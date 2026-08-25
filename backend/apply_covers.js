require('dotenv').config();
const fs = require('fs');
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

const manifest = JSON.parse(fs.readFileSync(__dirname + '/covers/manifest.json', 'utf8'));

async function main() {
  for (const p of manifest) {
    const result = await prisma.product.updateMany({
      where: { name: p.name },
      data: { image_url: p.dataUri }
    });
    console.log(result.count > 0
      ? `✅ Capa aplicada: ${p.name}`
      : `⚠️  Produto não encontrado: ${p.name}`);
  }
}

main()
  .catch(e => console.error('Erro:', e.message))
  .finally(() => prisma.$disconnect());
