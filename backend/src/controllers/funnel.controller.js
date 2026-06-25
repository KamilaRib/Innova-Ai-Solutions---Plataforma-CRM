const prisma = require('../lib/prisma');

exports.getFunnels = async (req, res) => {
  try {
    const funnels = await prisma.funnel.findMany({
      orderBy: { created_at: 'asc' }
    });
    res.json({ success: true, data: funnels });
  } catch (error) {
    console.error('Error fetching funnels:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

exports.createFunnel = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    
    const newFunnel = await prisma.funnel.create({
      data: {
        name,
        description,
        is_default: false
      }
    });
    res.status(201).json({ success: true, data: newFunnel });
  } catch (error) {
    console.error('Error creating funnel:', error);
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
    res.json({ success: true, message: 'Funnel deleted' });
  } catch (error) {
    console.error('Error deleting funnel:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
