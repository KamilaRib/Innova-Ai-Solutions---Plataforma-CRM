const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leads.controller');

// Rota para o n8n buscar o contexto do lead antes de classificar
router.get('/context/:phone', leadsController.getLeadContextByPhone);

// Rota para o n8n (ou frontend) atualizar o estágio do Kanban
router.patch('/:id', leadsController.updateLeadStatus);

module.exports = router;
