const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Rota GET: Usada exclusivamente pela Meta (WhatsApp Oficial) para autorizar o Webhook
router.get('/', webhookController.verifyMetaWebhook);

// Rota POST: Recebe as mensagens em tempo real (Evolution, Meta ou n8n)
router.post('/', webhookController.handleIncomingMessage);

module.exports = router;
