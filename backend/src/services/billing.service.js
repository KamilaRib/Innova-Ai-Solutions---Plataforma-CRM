const stripe = require('../lib/stripe');
const prisma = require('../lib/prisma');

// Garante que o Customer do CRM tem um Customer correspondente no Stripe, criando se necessário.
const getOrCreateStripeCustomer = async (customer) => {
  if (customer.stripe_customer_id) {
    return customer.stripe_customer_id;
  }

  const stripeCustomer = await stripe.customers.create({
    name: customer.name,
    email: customer.email || undefined,
    phone: customer.phone || undefined,
    address: customer.address
      ? {
          line1: customer.address,
          city: customer.city || undefined,
          state: customer.state || undefined,
          postal_code: customer.zip_code || undefined,
          country: customer.country || 'BR'
        }
      : undefined,
    metadata: { crm_customer_id: customer.id }
  });

  await prisma.customer.update({
    where: { id: customer.id },
    data: { stripe_customer_id: stripeCustomer.id }
  });

  return stripeCustomer.id;
};

/**
 * Cria e finaliza uma fatura no Stripe para um cliente do CRM, com cálculo
 * automático de imposto (Stripe Tax) quando o cliente tiver endereço cadastrado.
 */
const createInvoiceForCustomer = async ({ customerId, leadId, description, amount, currency = 'brl', createdBy }) => {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer) {
    const error = new Error('Cliente não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  const stripeCustomerId = await getOrCreateStripeCustomer(customer);

  // Cria a fatura em rascunho primeiro, e anexa o item de cobrança diretamente a ela
  // (a partir da API 2022-11-15 a Stripe deixou de anexar itens pendentes automaticamente).
  //
  // Stripe Tax não está disponível para contas com país "BR" (Brasil não está na lista
  // de países suportados pelo cálculo automático de imposto da Stripe). Se um dia a conta
  // migrar para um país suportado, é só voltar `automatic_tax: { enabled: true }`.
  const draftInvoice = await stripe.invoices.create({
    customer: stripeCustomerId,
    collection_method: 'send_invoice',
    days_until_due: 7,
    metadata: { crm_customer_id: customer.id, crm_lead_id: leadId || '' }
  });

  await stripe.invoiceItems.create({
    customer: stripeCustomerId,
    invoice: draftInvoice.id,
    amount: Math.round(Number(amount) * 100), // Stripe trabalha em centavos
    currency,
    description
  });

  const finalized = await stripe.invoices.finalizeInvoice(draftInvoice.id);
  await stripe.invoices.sendInvoice(draftInvoice.id);

  const record = await prisma.invoice.create({
    data: {
      customer_id: customer.id,
      lead_id: leadId || null,
      created_by: createdBy,
      stripe_invoice_id: finalized.id,
      stripe_customer_id: stripeCustomerId,
      description,
      amount_due: finalized.amount_due / 100,
      currency: finalized.currency,
      status: finalized.status,
      hosted_invoice_url: finalized.hosted_invoice_url,
      invoice_pdf: finalized.invoice_pdf
    }
  });

  return record;
};

module.exports = { getOrCreateStripeCustomer, createInvoiceForCustomer };
