const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');

// Rota pública para puxar dados antes de fazer login
router.get('/public', settingsController.getPublicSettings);

// Rotas administrativas
router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

module.exports = router;
