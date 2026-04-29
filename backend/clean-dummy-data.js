require('dotenv').config();
const prisma = require('./src/lib/prisma');

async function cleanData() {
  try {
    console.log('Iniciando limpeza de dados...');
    
    // Ordem inversa das relações para evitar erros de FK
    const deletedMessages = await prisma.message.deleteMany();
    console.log(`- Mensagens apagadas: ${deletedMessages.count}`);
    
    const deletedLeads = await prisma.lead.deleteMany();
    console.log(`- Leads apagados: ${deletedLeads.count}`);
    
    const deletedCustomers = await prisma.customer.deleteMany();
    console.log(`- Clientes apagados: ${deletedCustomers.count}`);
    
    console.log('Limpeza concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a limpeza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanData();
