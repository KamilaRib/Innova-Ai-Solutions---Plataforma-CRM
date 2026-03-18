const express = require('express');
const cors = require('cors');

// Registrando Controladores
const webhookRoutes = require('./routes/webhook.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(express.json());
app.use(cors());

// Rotas da API
app.use('/auth', authRoutes); // Login das Secretárias e Sócios
app.use('/webhook', webhookRoutes); // Entrada de Dados via WhatsApp Oficial/Evolution

// Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
