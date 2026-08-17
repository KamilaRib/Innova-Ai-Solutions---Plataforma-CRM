const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

async function resetPassword() {
  await client.connect();
  try {
    const password = 'Senha123!';
    const hash = await bcrypt.hash(password, 10);
    
    // Update the kamila account
    await client.query('UPDATE "User" SET password_hash = $1 WHERE email = $2', [hash, 'kamila.ribeiro@innovaaisolutions.com.br']);
    console.log('Senha de kamila.ribeiro@innovaaisolutions.com.br atualizada para: ' + password);

    // Update the teste gestor account as well just in case
    const hash2 = await bcrypt.hash('Senha123!', 10);
    await client.query('UPDATE "User" SET password_hash = $1 WHERE email = $2', [hash2, 'teste.gestor@innovaaisolutions.com.br']);
    console.log('Senha de teste.gestor@innovaaisolutions.com.br atualizada para: ' + password);
    
  } catch (err) {
    console.error(err);
  }
  await client.end();
}
resetPassword();
