const express = require('express');
const cors = require('cors');

// Registrando Controladores
const webhookRoutes = require('./routes/webhook.routes');

const app = express();

app.use(express.json());
app.use(cors());

// Rota de Webhook Agnóstico (Entrada do Funil / Atendimento)
app.use('/webhook', webhookRoutes);

// Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
