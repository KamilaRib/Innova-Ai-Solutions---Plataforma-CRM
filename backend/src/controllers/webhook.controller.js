// Controlador agnóstico e em tempo real (24/7)
// Lida com a decisão de "O Bot responde?" vs "Pausado para a Secretária"

const verifyMetaWebhook = (req, res) => {
  // A Meta/Facebook testa a sua conexão passando esses dados antes de ativar o seu número lá no painel.
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token) {
    console.log('✅ WhatsApp Webhook Verificado com a Meta!');
    return res.status(200).send(challenge);
  }
  
  return res.sendStatus(403);
};

const handleIncomingMessage = async (req, res) => {
  try {
    const payload = req.body;
    
    // Retornamos 200 OK muito rapidamente. APIs do WhatsApp e n8n exigem resposta rápida (menos de 3s)
    res.status(200).send('EVENT_RECEIVED');

    // ----------------------------------------------------
    // LÓGICA ASSÍNCRONA DE PROCESSAMENTO DA MENSAGEM
    // ----------------------------------------------------
    console.log('Nova mensagem recebida! Processando em background...');

    /*
      TODO: Implementações futuras usando Prisma:
      1. Extrair os dados brutos (se veio do Evolution ou da Meta).
      2. Consultar o Banco de Dados (PostgreSQL) usando o telefone do Lead e o Tenant da empresa.
      3. Chave Mágica 24/7:
         
         const lead = await prisma.lead.findUnique(...)
         
         if (lead.is_bot_paused === false) {
           // O Robô do n8n (agente) é 24/7! Ninguém interviu.
           // -> Repassa (POST) a mensagem para o endereço do Webhook lá do software do n8n.
         } else {
           // A automação foi pausada pela secretária (Modo Humano)
           // -> Apenas salva a nova mensagem no banco (Message table) com sender='client'
           // -> Envia evento WebSocket (Tempo Real) para o PC da secretária avisando que o cliente respondeu.
         }
    */

  } catch (error) {
    console.error("Erro interno no processamento do Webhook:", error);
  }
};

module.exports = {
  verifyMetaWebhook,
  handleIncomingMessage
};
