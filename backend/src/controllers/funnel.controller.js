const prisma = require('../lib/prisma');
const { logAudit } = require('../services/audit.service');

exports.getFunnels = async (req, res) => {
  try {
    let funnels = await prisma.funnel.findMany({
      orderBy: { created_at: 'asc' }
    });

    // Se o banco estiver sem nenhum funil, garante a criação do Funil Principal no Postgres
    if (funnels.length === 0) {
      const defaultFunnel = await prisma.funnel.create({
        data: {
          name: 'Funil Principal',
          description: 'Funil padrão de vendas',
          is_default: true
        }
      });
      funnels = [defaultFunnel];
    }

    res.json({ success: true, data: funnels });
  } catch (error) {
    console.error('Error fetching funnels:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

exports.createFunnel = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    
    const newFunnel = await prisma.funnel.create({
      data: {
        name: name.trim(),
        description,
        is_default: false
      }
    });

    await logAudit({
      usuario_id: req.user?.user_id || req.user?.id,
      entidade: 'Funnel',
      entidade_id: newFunnel.id,
      acao: 'CREATE',
      antes: null,
      depois: newFunnel
    });

    res.status(201).json({ success: true, data: newFunnel });
  } catch (error) {
    console.error('Error creating funnel:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

exports.updateFunnel = async (req, res) => {
  try {
    let { id } = req.params;
    const { name, description } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    let funnel = null;

    if (id === 'default' || id === 'undefined' || !id) {
      funnel = await prisma.funnel.findFirst({ where: { is_default: true } });
      if (!funnel) {
        funnel = await prisma.funnel.findFirst({ orderBy: { created_at: 'asc' } });
      }
      if (!funnel) {
        funnel = await prisma.funnel.create({
          data: {
            name: name.trim(),
            description: description || 'Funil padrão de vendas',
            is_default: true
          }
        });
        return res.json({ success: true, data: funnel });
      }
      id = funnel.id;
    } else {
      funnel = await prisma.funnel.findUnique({ where: { id } });
    }

    if (!funnel) {
      // Se não achar pelo ID fornecido, tenta atualizar o funil padrão
      funnel = await prisma.funnel.findFirst({ where: { is_default: true } }) 
        || await prisma.funnel.findFirst({ orderBy: { created_at: 'asc' } });
      
      if (!funnel) {
        funnel = await prisma.funnel.create({
          data: {
            name: name.trim(),
            description: description || 'Funil padrão de vendas',
            is_default: true
          }
        });
        return res.json({ success: true, data: funnel });
      }
      id = funnel.id;
    }

    const updatedFunnel = await prisma.funnel.update({
      where: { id: funnel.id },
      data: {
        name: name.trim(),
        ...(description !== undefined && { description })
      }
    });

    await logAudit({
      usuario_id: req.user?.user_id || req.user?.id,
      entidade: 'Funnel',
      entidade_id: funnel.id,
      acao: 'UPDATE',
      antes: funnel,
      depois: updatedFunnel
    });

    res.json({ success: true, data: updatedFunnel });
  } catch (error) {
    console.error('Error updating funnel:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


exports.deleteFunnel = async (req, res) => {
  try {
    const { id } = req.params;
    // Evitar deletar funil padrão ou funil com leads
    const funnel = await prisma.funnel.findUnique({ where: { id }, include: { _count: { select: { leads: true } } } });
    
    if (!funnel) {
      return res.status(404).json({ success: false, error: 'Funnel not found' });
    }
    if (funnel.is_default) {
      return res.status(400).json({ success: false, error: 'Cannot delete default funnel' });
    }
    if (funnel._count.leads > 0) {
      return res.status(400).json({ success: false, error: 'Cannot delete funnel with leads' });
    }

    await prisma.funnel.delete({ where: { id } });

    await logAudit({
      usuario_id: req.user?.user_id,
      entidade: 'Funnel',
      entidade_id: id,
      acao: 'DELETE',
      antes: funnel,
      depois: null
    });

    res.json({ success: true, message: 'Funnel deleted' });
  } catch (error) {
    console.error('Error deleting funnel:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

