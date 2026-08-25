require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.create({
    data: {
      name: 'INNOVA AI Knowledge Intelligence',
      price: 0,
      category: 'AGENTE IA',
      desc: `O conhecimento da sua empresa, conectado à Inteligência Artificial.

Uma plataforma desenvolvida para organizar e tornar o conhecimento corporativo acessível por meio de consultas inteligentes a documentos e bases de informação.`,
      image_url: ''
    }
  });
  console.log('✅ Produto cadastrado: INNOVA AI Knowledge Intelligence');
}

main()
  .catch(e => console.error('Erro:', e.message))
  .finally(() => prisma.$disconnect());
