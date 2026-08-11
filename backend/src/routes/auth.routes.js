const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Rota POST: Onde o React enviará o Email e a Senha da Secretária ou ADM
router.post('/login', authController.login);

// Rotas de Cadastro e Recuperação de Senha
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
