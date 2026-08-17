const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.mggqatrezhqnhhnpjobv:K%40h437581573@aws-1-us-east-1.pooler.supabase.com:5432/postgres'
});

async function main() {
  await client.connect();
  const query = `
    INSERT INTO "Product" (id, name, "desc", price, category, image_url, created_at) 
    VALUES (
      gen_random_uuid(), 
      'Agente CRM Innova IA (Funil Automático)', 
      'Fluxo do Agente:\n1. O lead entra via formulário.\n2. Salva no Google Sheets e aciona o n8n.\n3. Agente com RAG (Google Drive) atua como Especialista Martech.\n4. Qualificação:\n- Quente: Agendamento com especialista para apresentar a plataforma.\n- Morno: Investigação de objeções (O que impede de adquirir o serviço? Como podemos ajudar?).\n- Frio: Fluxo de nutrição (Flow).', 
      6500, 
      'Agente IA', 
      '', 
      now()
    )
  `;
  await client.query(query);
  console.log('✅ Agente CRM Innova IA cadastrado com sucesso direto no Postgres!');
  await client.end();
}

main().catch(e => {
  console.error('Erro:', e);
  client.end();
});
