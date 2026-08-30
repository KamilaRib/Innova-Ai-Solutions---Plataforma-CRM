const express = require('express');
const router = express.Router();
const funnelController = require('../controllers/funnel.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', funnelController.getFunnels);
router.get('/:id/leads', funnelController.getFunnelLeads);
router.post('/', authenticate, authorize('ADMINISTRADOR', 'COMERCIAL'), funnelController.createFunnel);
router.put('/:id', authenticate, authorize('ADMINISTRADOR', 'COMERCIAL'), funnelController.updateFunnel);
router.delete('/:id', authenticate, authorize('ADMINISTRADOR', 'COMERCIAL'), funnelController.deleteFunnel);

module.exports = router;


