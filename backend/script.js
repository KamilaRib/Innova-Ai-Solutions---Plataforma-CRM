const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.findFirst({ where: { role: 'ADM' } });
  if (!user) {
    console.log('No admin user');
    return;
  }
  await prisma.socialConnection.upsert({
    where: { instance_id: 'AgênciaCrm' },
    update: {
      api_key: '0A4DA508948E-457D-B0C4-07E991A5B162',
      status: 'CONNECTED'
    },
    create: {
      user_id: user.id,
      provider: 'WHATSAPP',
      instance_id: 'AgênciaCrm',
      name: 'WhatsApp Evolution',
      api_key: '0A4DA508948E-457D-B0C4-07E991A5B162',
      status: 'CONNECTED'
    }
  });
  console.log('Successfully saved to DB');
}

run().finally(() => prisma.$disconnect());
