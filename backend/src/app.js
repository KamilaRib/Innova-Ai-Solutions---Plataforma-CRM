const express = require('express');
const cors = require('cors');

// Registrando Controladores
const webhookRoutes = require('./routes/webhook.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limita cada IP a 5 tentativas por janela de 15 minutos
  message: { error: 'Muitas tentativas de acesso. Por favor, tente novamente após 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());
app.use(cors());

// Rotas da API
app.use('/auth', authLimiter, authRoutes); // Proteção contra força bruta no Login/Recuperação
app.use('/webhook', webhookRoutes); // Entrada de Dados via WhatsApp Oficial/Evolution
app.use('/api/settings', require('./routes/settings.routes')); // Configurações Globais (Logo, Cores)

// Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
