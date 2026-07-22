const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'chave-super-segura-white-label';

// Exige um JWT válido no header Authorization: Bearer <token>. Anexa o usuário em req.user.
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token de acesso ausente.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token de acesso inválido ou expirado.' });
  }
};

// Restringe a rota aos perfis informados. Deve vir depois de `authenticate`.
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado.' });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Você não tem permissão para acessar este recurso.' });
  }
  next();
};

module.exports = { authenticate, authorize };
