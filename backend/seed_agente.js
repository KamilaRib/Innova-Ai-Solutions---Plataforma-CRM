require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Tentando usar a porta 5432 (DIRECT_URL) para evitar bloqueios de pooler
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function main() {
  await prisma.product.create({
    data: {
      name: 'Agente CRM Innova IA (Funil Automático)',
      price: 6500,
      category: 'Agente IA',
      desc: `Fluxo do Agente:
1. O lead entra via formulário.
2. Salva no Google Sheets e aciona o n8n.
3. Agente com RAG (Google Drive) atua como Especialista Martech.
4. Qualificação:
- Quente: Agendamento com especialista para apresentar a plataforma.
- Morno: Investigação de objeções (O que impede de adquirir o serviço? Como podemos ajudar?).
- Frio: Fluxo de nutrição (Flow).`,
      image_url: '' 
    }
  });
  console.log('✅ Agente CRM Innova IA cadastrado com sucesso!');
}

main()
  .catch(e => console.error('Erro:', e.message))
  .finally(() => prisma.$disconnect());
