const prisma = require('../lib/prisma');

/**
 * Retorna as estatísticas para o Dashboard
 */
const getStats = async (req, res) => {
  try {
    const totalLeads = await prisma.lead.count();
    const leadsAtivos = await prisma.lead.count({
      where: {
        NOT: [
          { pipeline_status: 'Ganhos' },
          { pipeline_status: 'Perdidos' }
        ]
      }
    });
    const leadsGanhos = await prisma.lead.count({
      where: { pipeline_status: 'Ganhos' }
    });
    const leadsPerdidos = await prisma.lead.count({
      where: { pipeline_status: 'Perdidos' }
    });

    const totalMessages = await prisma.message.count({
      where: {
        created_at: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        leadsAtivos,
        leadsGanhos,
        leadsPerdidos,
        totalMessages
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas.' });
  }
};

/**
 * Lista todos os leads (Kanban)
 */
const getAll = async (req, res) => {
  try {
    const { funnel_id } = req.query;
    const whereClause = funnel_id ? { funnel_id } : {};

    const leads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: { last_contacted_at: 'desc' }
    });
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    console.error('Erro ao listar leads:', error);
    res.status(500).json({ error: 'Erro ao listar leads.' });
  }
};

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
    let { pipeline_status } = req.body;

    // Mapeamento secreto de ID numérico para o nome real da etapa (n8n usa o número)
    const statusMap = {
      '1': 'Início de Atendimento',
      '2': 'Conversando',
      '3': 'Agendamento',
      '4': 'Formulário Enviado',
      '5': 'Follow Up'
    };

    if (pipeline_status && statusMap[pipeline_status]) {
      pipeline_status = statusMap[pipeline_status];
    }

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

/**
 * Cria um lead originado do catálogo público
 */
const createPublicLead = async (req, res) => {
  try {
    const { name, phone, email, productName } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Nome e WhatsApp são obrigatórios.' });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        source: 'Website',
        pipeline_status: 'Início de Atendimento',
        notes: productName ? `Interesse no produto: ${productName}` : null
      }
    });

    // Dispara o Webhook para o n8n iniciar o atendimento
    try {
      await fetch('https://n8n.agency-innova-ai-solutions.cloud/webhook/CRM', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'novo_lead_catalogo',
          lead_id: lead.id,
          name: lead.name,
          phone: lead.phone,
          email: lead.email || '',
          product: productName || 'Nenhum'
        })
      });
      console.log(`[Webhook] Notificação enviada ao n8n para o lead: ${lead.name}`);
    } catch (webhookError) {
      console.error('Erro ao disparar webhook para o n8n:', webhookError);
      // Não retorna erro pro frontend, pois o lead já foi salvo com sucesso no CRM.
    }

    res.status(201).json({
      success: true,
      message: 'Interesse registrado com sucesso! Entraremos em contato.',
      lead
    });
  } catch (error) {
    console.error('Erro ao criar lead público:', error);
    res.status(500).json({ error: 'Erro interno ao registrar interesse.' });
  }
};

// ==========================================
// FUNÇÕES EXCLUSIVAS PARA O AGENTE DE IA (N8N)
// ==========================================

/**
 * Cria ou atualiza um lead via telefone (Usado pelo n8n crm_criar_ou_atualizar_lead)
 */
const upsertN8nLead = async (req, res) => {
  try {
    const { nome, telefone, origem, etapa, observacao } = req.body;

    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
    }

    let lead = await prisma.lead.findFirst({ where: { phone: telefone } });

    // Mapeia etapa enviada pelo n8n para o formato do CRM (se necessário)
    let pipeline_status = 'Início de Atendimento';
    if (etapa === 'qualificando') pipeline_status = 'Conversando';
    else if (etapa === 'qualificado') pipeline_status = 'Conversando';
    else if (etapa === 'sessao_agendada') pipeline_status = 'Agendamento';
    else if (etapa === 'perdido') pipeline_status = 'Perdidos';

    if (lead) {
      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: {
          name: nome,
          pipeline_status,
          notes: observacao ? `${lead.notes || ''}\n[IA] Observação: ${observacao}` : lead.notes,
          last_contacted_at: new Date()
        }
      });
    } else {
      lead = await prisma.lead.create({
        data: {
          name: nome,
          phone: telefone,
          source: origem || 'WhatsApp - Agente IA',
          pipeline_status,
          notes: observacao ? `[IA] Observação: ${observacao}` : null,
          last_contacted_at: new Date()
        }
      });
    }

    res.status(200).json({ success: true, cliente_id: lead.id, lead });
  } catch (error) {
    console.error('Erro ao upsertN8nLead:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
};

/**
 * Atualiza a etapa do lead (Usado pelo n8n crm_mover_card)
 */
const updateN8nStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { etapa, motivo } = req.body;

    let pipeline_status = 'Início de Atendimento';
    if (etapa === 'qualificando') pipeline_status = 'Conversando';
    else if (etapa === 'qualificado') pipeline_status = 'Conversando'; // Pode criar uma coluna separada se quiser
    else if (etapa === 'sessao_agendada') pipeline_status = 'Agendamento';
    else if (etapa === 'perdido') pipeline_status = 'Perdidos';

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        pipeline_status,
        last_contacted_at: new Date(),
        notes: motivo ? `[IA] Mudança para ${etapa}: ${motivo}` : undefined
      }
    });

    res.status(200).json({ success: true, lead });
  } catch (error) {
    console.error('Erro ao updateN8nStatus:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
};

/**
 * Registra uma nota no lead (Usado pelo n8n crm_registrar_nota)
 */
const addN8nNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { nota, autor } = req.body;

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

    await prisma.lead.update({
      where: { id },
      data: {
        notes: lead.notes ? `${lead.notes}\n[${autor || 'IA'}] ${nota}` : `[${autor || 'IA'}] ${nota}`
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao addN8nNote:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
};

module.exports = {
  getStats,
  getAll,
  getLeadContextByPhone,
  updateLeadStatus,
  createPublicLead,
  upsertN8nLead,
  updateN8nStatus,
  addN8nNote
};
