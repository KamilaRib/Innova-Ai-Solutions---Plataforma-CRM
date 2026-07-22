const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Rota pública para puxar dados antes de fazer login
router.get('/public', settingsController.getPublicSettings);

// Rotas administrativas (contêm tokens e chaves sensíveis)
router.get('/', authenticate, authorize('ADMINISTRADOR'), settingsController.getSettings);
router.put('/', authenticate, authorize('ADMINISTRADOR'), settingsController.updateSettings);

module.exports = router;
