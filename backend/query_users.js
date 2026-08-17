const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

async function main() {
  await client.connect();
  try {
    const res = await client.query('SELECT id, name, email, role FROM "User"'); // the table name might be lower or upper case, prisma usually upper cases models by default if not mapped
    console.log(res.rows);
  } catch (err) {
    console.error(err);
    try {
      const res = await client.query('SELECT id, name, email, role FROM users');
      console.log(res.rows);
    } catch(err2) {
      console.error(err2);
    }
  }
  await client.end();
}
main();
