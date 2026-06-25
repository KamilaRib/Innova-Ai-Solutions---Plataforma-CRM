const express = require('express');
const router = express.Router();
const funnelController = require('../controllers/funnel.controller');

router.get('/', funnelController.getFunnels);
router.post('/', funnelController.createFunnel);
router.delete('/:id', funnelController.deleteFunnel);

module.exports = router;
