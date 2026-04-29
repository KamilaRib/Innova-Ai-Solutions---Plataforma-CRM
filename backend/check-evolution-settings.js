require('dotenv').config();
const prisma = require('./src/lib/prisma');

async function checkSettings() {
  try {
    const settings = await prisma.systemSettings.findFirst();
    console.log(JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSettings();
