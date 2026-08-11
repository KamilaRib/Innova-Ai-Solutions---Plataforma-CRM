const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leads.controller');

// Rota para estatísticas do dashboard
router.get('/stats', leadsController.getStats);

// Rota para listar todos os leads (Kanban)
router.get('/', leadsController.getAll);

// Rota para o n8n buscar o contexto do lead antes de classificar
router.get('/context/:phone', leadsController.getLeadContextByPhone);

// Rota pública para captura de leads do catálogo
router.post('/public', leadsController.createPublicLead);

// Rota para o n8n (ou frontend) atualizar o estágio do Kanban
router.patch('/:id', leadsController.updateLeadStatus);

module.exports = router;
