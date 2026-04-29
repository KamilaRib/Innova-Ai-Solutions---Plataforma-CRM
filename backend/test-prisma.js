require('dotenv').config();
const prisma = require('./src/lib/prisma');

async function test() {
  try {
    const leads = await prisma.lead.findMany();
    console.log('Leads found:', leads.length);
    if (leads.length > 0) {
      console.log('First lead:', leads[0]);
    }
  } catch (error) {
    console.error('Test failed:');
    console.dir(error, { depth: null });
  } finally {
    await prisma.$disconnect();
  }
}

test();
