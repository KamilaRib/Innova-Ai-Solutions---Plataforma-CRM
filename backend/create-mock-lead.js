require('dotenv').config();
const prisma = require('./src/lib/prisma');

async function createMockLead() {
  try {
    const lead = await prisma.lead.create({
      data: {
        name: 'Cliente Teste',
        phone: '1234567890',
        source: 'WhatsApp',
        pipeline_status: 'Início de Atendimento'
      }
    });
    console.log('Mock lead created:', lead.id);
  } catch (error) {
    console.error('Failed to create lead:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMockLead();
