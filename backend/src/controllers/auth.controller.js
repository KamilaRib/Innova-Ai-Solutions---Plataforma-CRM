const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const mailService = require('../services/mail.service');

const JWT_SECRET = process.env.JWT_SECRET || 'chave-super-segura-white-label';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { user_id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.status(200).json({
      success: true,
      token,
      user_data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro Interno de Login:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao processar seu login.' });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Este e-mail já está em uso.' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role: 'ADMINISTRADOR', // Quem cria a empresa vira admin
      }
    });

    res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso! Faça login para continuar.'
    });
  } catch (error) {
    console.error('Erro no Registro:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao criar a conta.' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'E-mail é obrigatório.' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Retorna sucesso igual para evitar user enumeration
      return res.status(200).json({ success: true, message: 'Se o e-mail existir, um link de recuperação será enviado.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hora de validade

    await prisma.user.update({
      where: { id: user.id },
      data: {
        recovery_token: token,
        recovery_token_expires: expires
      }
    });

    // Constrói URL base dinamicamente com base no origin da requisição ou variáveis de ambiente
    const baseUrl = process.env.FRONTEND_URL || process.env.APP_URL || req.headers.origin || 'http://localhost:5173';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // Disparo real via SMTP
    try {
      await mailService.sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetLink
      });
    } catch (mailError) {
      console.error('Erro ao enviar e-mail via SMTP:', mailError);
      // Mantém a resposta amigável para não vazar detalhes ou travar a requisição
    }

    res.status(200).json({ success: true, message: 'Se o e-mail existir, um link de recuperação será enviado.' });
  } catch (error) {
    console.error('Erro no Forgot Password:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao processar a solicitação.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        recovery_token: token,
        recovery_token_expires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    const password_hash = await bcrypt.hash(new_password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash,
        recovery_token: null,
        recovery_token_expires: null
      }
    });

    res.status(200).json({ success: true, message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Erro no Reset Password:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao redefinir a senha.' });
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword
};
