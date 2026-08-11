const express = require('express');
const router = express.Router();
const webhooksController = require('../controllers/webhooks.controller');

// Rota para receber atualizações do Gateway Fiscal sobre NFS-e
// Como é um webhook externo, não usamos middleware 'authenticate' do CRM.
// Em produção, você validaria um header X-Gateway-Token.
router.post('/nfse', webhooksController.handleNFSeWebhook);

module.exports = router;
