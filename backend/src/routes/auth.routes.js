const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Rota POST: Onde o React enviará o Email e a Senha da Secretária ou ADM
router.post('/login', authController.login);

module.exports = router;
