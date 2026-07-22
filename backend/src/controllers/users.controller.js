const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { logAudit } = require('../services/audit.service');

const ALLOWED_ROLES = ['ADMINISTRADOR', 'MARKETING', 'COMERCIAL', 'GESTOR'];

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  active: u.active,
  created_at: u.created_at
});

const listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { created_at: 'asc' } });
    res.status(200).json({ success: true, data: users.map(publicUser) });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno ao listar usuários.' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Nome, e-mail, senha e nível de acesso são obrigatórios.' });
    }
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: `Nível de acesso inválido. Use um de: ${ALLOWED_ROLES.join(', ')}.` });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Já existe um usuário com este e-mail.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password_hash, role }
    });

    await logAudit({
      usuario_id: req.user.user_id,
      entidade: 'User',
      entidade_id: user.id,
      acao: 'CREATE',
      antes: null,
      depois: publicUser(user)
    });

    res.status(201).json({ success: true, data: publicUser(user) });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno ao criar usuário.' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, active, password } = req.body;

    const before = await prisma.user.findUnique({ where: { id } });
    if (!before) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    if (role && !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: `Nível de acesso inválido. Use um de: ${ALLOWED_ROLES.join(', ')}.` });
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (role !== undefined) data.role = role;
    if (active !== undefined) data.active = active;
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' });
      }
      data.password_hash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({ where: { id }, data });

    await logAudit({
      usuario_id: req.user.user_id,
      entidade: 'User',
      entidade_id: user.id,
      acao: 'UPDATE',
      antes: publicUser(before),
      depois: publicUser(user)
    });

    res.status(200).json({ success: true, data: publicUser(user) });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar usuário.' });
  }
};

// Exclusão lógica: usuários nunca são apagados de verdade (rastreabilidade de auditoria).
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.user_id) {
      return res.status(400).json({ error: 'Você não pode desativar sua própria conta.' });
    }

    const before = await prisma.user.findUnique({ where: { id } });
    if (!before) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const user = await prisma.user.update({ where: { id }, data: { active: false } });

    await logAudit({
      usuario_id: req.user.user_id,
      entidade: 'User',
      entidade_id: user.id,
      acao: 'DELETE',
      antes: publicUser(before),
      depois: publicUser(user)
    });

    res.status(200).json({ success: true, message: 'Usuário desativado.' });
  } catch (error) {
    console.error('Erro ao desativar usuário:', error);
    res.status(500).json({ error: 'Erro interno ao desativar usuário.' });
  }
};

module.exports = { listUsers, createUser, updateUser, deactivateUser };
