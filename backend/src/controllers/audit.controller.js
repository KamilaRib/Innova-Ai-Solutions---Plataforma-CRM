const prisma = require('../lib/prisma');

// Consulta a trilha de auditoria, filtrável por período, usuário e entidade (RNF-AUD-01).
const listAudit = async (req, res) => {
  try {
    const { usuario_id, entidade, from, to, page = 1, pageSize = 50 } = req.query;

    const where = {};
    if (usuario_id) where.usuario_id = usuario_id;
    if (entidade) where.entidade = entidade;
    if (from || to) {
      where.created_at = {};
      if (from) where.created_at.gte = new Date(from);
      if (to) where.created_at.lte = new Date(to);
    }

    const take = Math.min(Number(pageSize) || 50, 200);
    const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

    const [data, total] = await Promise.all([
      prisma.auditoria.findMany({
        where,
        include: { usuario: { select: { id: true, name: true, email: true } } },
        orderBy: { created_at: 'desc' },
        take,
        skip
      }),
      prisma.auditoria.count({ where })
    ]);

    res.status(200).json({ success: true, data, total, page: Number(page), pageSize: take });
  } catch (error) {
    console.error('Erro ao consultar auditoria:', error);
    res.status(500).json({ error: 'Erro interno ao consultar auditoria.' });
  }
};

module.exports = { listAudit };
