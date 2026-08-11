const express = require('express');
const cors = require('cors');
const path = require('path');

// Registrando Controladores
const webhookRoutes = require('./routes/webhook.routes');
const authRoutes = require('./routes/auth.routes');
const { handleStripeWebhook } = require('./controllers/stripeWebhook.controller');
const { authenticate, authorize } = require('./middleware/auth.middleware');

const app = express();

// O app roda atrás do proxy/CDN da Hostinger. Sem isso, o Express enxerga o IP do
// proxy em vez do IP real do visitante, e o rate limiter (abaixo) acaba tratando
// todo mundo como se fosse uma única pessoa.
app.set('trust proxy', 1);

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limita cada IP a 5 tentativas por janela de 15 minutos
  message: { error: 'Muitas tentativas de acesso. Por favor, tente novamente após 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Precisa do corpo em bruto (não JSON-parseado) para validar a assinatura do Stripe.
// Por isso é registrada ANTES do express.json() global.
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rotas da API
app.use('/auth', authLimiter, authRoutes); // Proteção contra força bruta no Login/Recuperação
app.use('/webhook', webhookRoutes); // Entrada de Dados via WhatsApp Oficial/Evolution
app.use('/api/settings', require('./routes/settings.routes')); // Configurações Globais (Logo, Cores)
app.use('/api/funnels', require('./routes/funnels.routes')); // Gestão de Funis
app.use('/api/leads', require('./routes/leads.routes')); // Gestão de Leads e Kanban
app.use('/api/customers', require('./routes/customers.routes')); // Gestão de Clientes (Cadastro) — consumido também pelo n8n
app.use('/api/catalog', require('./routes/catalog.routes')); // Catálogo de Criativos e Produtos
app.use('/api/social-auth', require('./routes/auth.social.routes')); // Hub de Conexões (OAuth)
app.use('/api/integrations', require('./routes/integrations.routes')); // Integrações de Redes Sociais
app.use('/api/billing', require('./routes/billing.routes')); // Faturas via Stripe (Invoicing + Tax)
app.use('/api/posts', require('./routes/posts.routes')); // Módulo de Redes Sociais
app.use('/api/v1/webhooks', require('./routes/webhooks.routes')); // Webhooks Passivos (NFS-e, etc)
app.use('/api/users', authenticate, authorize('ADMINISTRADOR'), require('./routes/users.routes')); // Gestão de Acessos (RBAC)
app.use('/api/auditoria', authenticate, authorize('ADMINISTRADOR'), require('./routes/audit.routes')); // Trilha de auditoria (RN009)

// Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Servir arquivos estáticos do Frontend (React/Vite)
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Qualquer outra requisição que não seja API vai para o index.html do React
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  } else {
    next();
  }
});

module.exports = app;
