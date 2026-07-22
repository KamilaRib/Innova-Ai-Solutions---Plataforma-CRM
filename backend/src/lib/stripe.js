const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️  STRIPE_SECRET_KEY não configurada — funcionalidades de cobrança ficarão indisponíveis.');
}

// Versão fixa da API (em vez do padrão do SDK, que muda com frequência e já quebrou
// a sintaxe de anexar itens a faturas entre versões).
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20'
});

module.exports = stripe;
