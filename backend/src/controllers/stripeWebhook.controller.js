const stripe = require('../lib/stripe');
const prisma = require('../lib/prisma');
const { logAudit } = require('../services/audit.service');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handleStripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET não configurado no servidor.');
    }
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error('Assinatura de webhook do Stripe inválida:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Responde rápido; o processamento abaixo é local e rápido também, mas seguimos o padrão dos outros webhooks.
  res.status(200).json({ received: true });

  try {
    const stripeInvoice = event.data.object;

    switch (event.type) {
      case 'invoice.paid': {
        const invoice = await prisma.invoice.update({
          where: { stripe_invoice_id: stripeInvoice.id },
          data: {
            status: 'paid',
            amount_paid: stripeInvoice.amount_paid / 100,
            paid_at: new Date()
          }
        });

        // Fecha o pipeline do lead vinculado, se houver.
        if (invoice.lead_id) {
          await prisma.lead.update({
            where: { id: invoice.lead_id },
            data: { pipeline_status: 'Ganhos' }
          });
        }

        await logAudit({
          usuario_id: invoice.created_by,
          entidade: 'Invoice',
          entidade_id: invoice.id,
          acao: 'UPDATE',
          antes: { status: 'open' },
          depois: { status: 'paid' }
        });
        break;
      }

      case 'invoice.payment_failed':
      case 'invoice.voided':
      case 'invoice.marked_uncollectible': {
        const statusMap = {
          'invoice.payment_failed': 'open',
          'invoice.voided': 'void',
          'invoice.marked_uncollectible': 'uncollectible'
        };
        await prisma.invoice.update({
          where: { stripe_invoice_id: stripeInvoice.id },
          data: { status: statusMap[event.type] }
        });
        break;
      }

      default:
        // Eventos não tratados são ignorados propositalmente.
        break;
    }
  } catch (error) {
    // Não retornamos erro para o Stripe aqui pois a resposta 200 já foi enviada;
    // o Stripe reenviaria o mesmo evento (idempotência) e o problema real está do nosso lado.
    console.error('Erro ao processar evento do Stripe:', event.type, error);
  }
};

module.exports = { handleStripeWebhook };
