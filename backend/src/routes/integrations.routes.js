const express = require('express');
const router = express.Router();
const integrationsController = require('../controllers/integrations.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', integrationsController.getIntegrations);
router.get('/:provider', integrationsController.getIntegrationByProvider);
router.post('/', integrationsController.upsertIntegration);
router.delete('/:id', integrationsController.deleteIntegration);

module.exports = router;
