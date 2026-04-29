const prisma = require('../lib/prisma');

/**
 * Busca o contexto de um lead pelo telefone (histórico de mensagens e status atual)
 */
const getLeadContextByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    // Busca o lead pelo telefone, incluindo as últimas 10 mensagens para contexto da IA
    const lead = await prisma.lead.findFirst({
      where: { phone },
      include: {
        messages: {
          orderBy: { created_at: 'desc' },
          take: 10
        }
      }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado.' });
    }

    // Inverte as mensagens para que fiquem em ordem cronológica
    lead.messages.reverse();

    res.status(200).json(lead);
  } catch (error) {
    console.error('Erro ao buscar contexto do lead:', error);
    res.status(500).json({ error: 'Erro interno ao buscar contexto.' });
  }
};

/**
 * Atualiza o status do lead no Kanban
 */
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { pipeline_status } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: { 
        pipeline_status,
        last_contacted_at: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: `Lead movido para: ${pipeline_status}`,
      lead
    });
  } catch (error) {
    console.error('Erro ao atualizar status do lead:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar status.' });
  }
};

module.exports = {
  getLeadContextByPhone,
  updateLeadStatus
};
