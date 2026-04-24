const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');

const readSettings = () => {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { business_name: 'INNOVA AI', logo_url: null, primary_color: '#00F5FF' };
  }
};

const writeSettings = (settings) => {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
};

// Retorna as configurações públicas (cor, logo e nome)
const getPublicSettings = async (req, res) => {
  try {
    const settings = readSettings();
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
    const settings = readSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error("Erro ao buscar configurações gerais:", error);
    res.status(500).json({ error: "Ocorreu um erro ao buscar os dados." });
  }
};

// Atualiza configurações globais
const updateSettings = async (req, res) => {
  try {
    const currentSettings = readSettings();
    const newSettings = { ...currentSettings, ...req.body };
    writeSettings(newSettings);
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

