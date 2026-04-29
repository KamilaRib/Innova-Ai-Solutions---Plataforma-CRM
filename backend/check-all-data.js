require('dotenv').config();
const prisma = require('./src/lib/prisma');

async function checkData() {
  try {
    const settings = await prisma.systemSettings.findFirst();
    console.log('--- System Settings ---');
    console.log(JSON.stringify(settings, null, 2));

    const connections = await prisma.socialConnection.findMany();
    console.log('--- Social Connections ---');
    console.log(JSON.stringify(connections, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
