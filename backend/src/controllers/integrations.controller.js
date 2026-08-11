const prisma = require('../lib/prisma');

// Lista todas as integrações configuradas
const getIntegrations = async (req, res) => {
  try {
    const integrations = await prisma.integration.findMany();
    res.status(200).json({ success: true, data: integrations });
  } catch (error) {
    console.error("Erro ao buscar integrações:", error);
    res.status(500).json({ error: "Erro ao buscar integrações." });
  }
};

// Retorna uma integração específica (pelo provider)
const getIntegrationByProvider = async (req, res) => {
  try {
    const { provider } = req.params;
    const integration = await prisma.integration.findFirst({
      where: { provider: provider.toUpperCase() }
    });
    
    if (!integration) {
      return res.status(404).json({ success: false, message: 'Integração não encontrada' });
    }
    
    res.status(200).json({ success: true, data: integration });
  } catch (error) {
    console.error(`Erro ao buscar integração ${req.params.provider}:`, error);
    res.status(500).json({ error: "Erro ao buscar integração." });
  }
};

// Cria ou atualiza uma integração
const upsertIntegration = async (req, res) => {
  try {
    const { provider, n8n_webhook, credentials, status } = req.body;

    if (!provider) {
      return res.status(400).json({ error: 'O campo provider é obrigatório.' });
    }

    const uppercaseProvider = provider.toUpperCase();

    // Busca se já existe uma integração para este provedor (já que por enquanto não usamos múltiplos profiles na UI)
    const existing = await prisma.integration.findFirst({
      where: { provider: uppercaseProvider }
    });

    let integration;
    if (existing) {
      integration = await prisma.integration.update({
        where: { id: existing.id },
        data: {
          n8n_webhook: n8n_webhook !== undefined ? n8n_webhook : existing.n8n_webhook,
          credentials: credentials !== undefined ? credentials : existing.credentials,
          status: status !== undefined ? status : existing.status,
        }
      });
    } else {
      integration = await prisma.integration.create({
        data: {
          provider: uppercaseProvider,
          n8n_webhook,
          credentials,
          status: status || 'CONNECTED'
        }
      });
    }

    res.status(200).json({ success: true, data: integration, message: 'Integração salva com sucesso' });
  } catch (error) {
    console.error("Erro ao salvar integração:", error);
    res.status(500).json({ error: "Ocorreu um erro ao salvar a integração." });
  }
};

// Deleta uma integração
const deleteIntegration = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.integration.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Integração removida' });
  } catch (error) {
    console.error("Erro ao remover integração:", error);
    res.status(500).json({ error: "Erro ao remover integração." });
  }
};

module.exports = {
  getIntegrations,
  getIntegrationByProvider,
  upsertIntegration,
  deleteIntegration
};
