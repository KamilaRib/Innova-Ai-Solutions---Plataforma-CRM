const prisma = require('../lib/prisma');
const { logAudit } = require('../services/audit.service');

// Garantir que a configuração exista (Singleton)
const getOrCreateSettings = async () => {
  let settings = await prisma.systemSettings.findUnique({ where: { id: "1" } });
  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: { id: "1" }
    });
  }
  return settings;
};

// Retorna as configurações públicas (cor, logo e nome)
const getPublicSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({
      success: true,
      data: {
        business_name: settings.business_name,
        logo_url: settings.logo_url,
        primary_color: settings.primary_color
      }
    });
  } catch (error) {
    console.error("Erro ao buscar configurações públicas:", error);
    res.status(500).json({ error: "Ocorreu um erro ao buscar os dados." });
  }
};

// Retorna todas as configurações (uso administrativo)
const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error("Erro ao buscar configurações gerais:", error);
    res.status(500).json({ error: "Ocorreu um erro ao buscar os dados." });
  }
};

// Atualiza configurações globais
const updateSettings = async (req, res) => {
  try {
    const currentSettings = await getOrCreateSettings();
    
    // Filtra apenas campos válidos para não quebrar o Prisma
    const allowedFields = [
      'business_name', 'logo_url', 'primary_color', 
      'whatsapp_phone_number_id', 'whatsapp_business_account_id', 
      'whatsapp_access_token', 'whatsapp_verify_token',
      'evolution_api_url', 'evolution_webhook_url', 'evolution_api_key', 
      'evolution_instance_name', 'evolution_events',
      'openai_api_key', 'ai_behavior', 'ai_concierge_webhook',
      'store_data', 'im', 'cnpj', 'ie', 'ibge_municipio',
      'codigo_servico_municipal', 'codigo_item_lc116', 'aliquota_iss', 'regime_especial_tributacao'
    ];
    
    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const newSettings = await prisma.systemSettings.update({
      where: { id: "1" },
      data: updateData
    });

    await logAudit({
      usuario_id: req.user.user_id,
      entidade: 'SystemSettings',
      acao: 'UPDATE',
      antes: currentSettings,
      depois: newSettings
    });

    res.status(200).json({ success: true, data: newSettings, message: 'Configurações salvas' });
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    res.status(500).json({ error: "Ocorreu um erro ao salvar configurações." });
  }
};

module.exports = {
  getPublicSettings,
  getSettings,
  updateSettings
};
