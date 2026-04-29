require('dotenv').config();
const prisma = require('./src/lib/prisma');

async function saveSettings() {
  try {
    // Tenta encontrar ou criar o registro único de configurações
    const settings = await prisma.systemSettings.upsert({
      where: { id: '1' },
      update: {
        evolution_webhook_url: 'http://localhost:8085',
        evolution_api_key: 'Scrmarketing_2026',
        evolution_instance_name: 'Innova_Main'
      },
      create: {
        id: '1',
        evolution_webhook_url: 'http://localhost:8085',
        evolution_api_key: 'Scrmarketing_2026',
        evolution_instance_name: 'Innova_Main'
      }
    });
    console.log('Configurações salvas com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
  } finally {
    await prisma.$disconnect();
  }
}

saveSettings();
