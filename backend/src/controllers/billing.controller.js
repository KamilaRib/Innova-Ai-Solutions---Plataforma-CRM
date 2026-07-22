const prisma = require('../lib/prisma');
const { createInvoiceForCustomer } = require('../services/billing.service');
const { logAudit } = require('../services/audit.service');

// Cria e envia uma fatura no Stripe para um Lead ou Cliente do CRM (RN004/KPIs de Receita).
const createInvoice = async (req, res) => {
  try {
    const { lead_id, customer_id, description, amount, currency } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ error: 'Descrição e valor são obrigatórios.' });
    }
    if (!lead_id && !customer_id) {
      return res.status(400).json({ error: 'Informe lead_id ou customer_id.' });
    }

    let resolvedCustomerId = customer_id;

    if (!resolvedCustomerId) {
      const lead = await prisma.lead.findUnique({ where: { id: lead_id } });
      if (!lead) {
        return res.status(404).json({ error: 'Lead não encontrado.' });
      }

      if (lead.customer_id) {
        resolvedCustomerId = lead.customer_id;
      } else {
        // Sem cliente vinculado ainda: cria um Customer básico a partir dos dados do Lead.
        const customer = await prisma.customer.upsert({
          where: { phone: lead.phone },
          update: { name: lead.name, email: lead.email || undefined },
          create: { name: lead.name, phone: lead.phone, email: lead.email || undefined }
        });
        await prisma.lead.update({ where: { id: lead.id }, data: { customer_id: customer.id } });
        resolvedCustomerId = customer.id;
      }
    }

    const invoice = await createInvoiceForCustomer({
      customerId: resolvedCustomerId,
      leadId: lead_id || null,
      description,
      amount,
      currency: currency || 'brl',
      createdBy: req.user.user_id
    });

    await logAudit({
      usuario_id: req.user.user_id,
      entidade: 'Invoice',
      entidade_id: invoice.id,
      acao: 'CREATE',
      antes: null,
      depois: invoice
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    console.error('Erro ao criar fatura:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Erro interno ao criar fatura.' });
  }
};

const listInvoices = async (req, res) => {
  try {
    const { customer_id, lead_id, status } = req.query;
    const where = {};
    if (customer_id) where.customer_id = customer_id;
    if (lead_id) where.lead_id = lead_id;
    if (status) where.status = status;

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: { customer: { select: { id: true, name: true, phone: true } } }
    });
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    console.error('Erro ao listar faturas:', error);
    res.status(500).json({ error: 'Erro interno ao listar faturas.' });
  }
};

module.exports = { createInvoice, listInvoices };
