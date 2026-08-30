const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leads.controller');

// Rota para estatísticas do dashboard
router.get('/stats', leadsController.getStats);

// Rota para listar todos os leads (Kanban)
router.get('/', leadsController.getAll);

// Rota para o n8n buscar o contexto do lead antes de classificar
router.get('/context/:phone', leadsController.getLeadContextByPhone);
router.get('/n8n/clientes/:phone', leadsController.getLeadContextByPhone);
router.get('/consulta/:phone', leadsController.getLeadContextByPhone);

// Rota pública para captura de leads do catálogo
router.post('/public', leadsController.createPublicLead);

// Rota para o n8n atualizar o estágio do Kanban
router.patch('/:id', leadsController.updateLeadStatus);

// Rotas de Mensagens (Chat em tempo real)
router.get('/:id/messages', leadsController.getLeadMessages);
router.post('/:id/messages', leadsController.sendLeadMessage);
router.post('/messages/sync', leadsController.syncIncomingMessage);

// ==========================================
// ROTAS EXCLUSIVAS PARA O AGENTE DE IA (N8N)
// ==========================================

// Criar ou atualizar lead
router.post('/n8n/clientes', leadsController.upsertN8nLead);

// Atualizar status por telefone (POST e PATCH /leads/update-status)
router.post('/update-status', leadsController.updateStatusByPhone);
router.post('/n8n/update-status', leadsController.updateStatusByPhone);
router.patch('/update-status', leadsController.updateStatusByPhone);

// Mover etapa do lead por ID
router.patch('/n8n/clientes/:id/etapa', leadsController.updateN8nStatus);

// Registrar nota
router.post('/n8n/clientes/:id/notas', leadsController.addN8nNote);

module.exports = router;

