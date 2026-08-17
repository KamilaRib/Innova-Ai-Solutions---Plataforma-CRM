const fs = require('fs');

async function updateWorkflow() {
  const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MTA3MTYwYS04YjYxLTQ2MDctYWUyMy1kYjhmODI1NmY0MDYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzgxMzQwNDg2fQ.QK3WMcYwRPQZNtp1uc2_7I88PNTgXoOtSz-joGFP90U";
  const apiUrl = "https://n8n.agency-innova-ai-solutions.cloud/api/v1/workflows/QyBYd0NU7kRskBg7";

  // Read original workflow
  const outputTxtPath = "C:\\Users\\kamil\\.gemini\\antigravity-ide\\brain\\8b73a363-5019-4090-bc87-2313d324bf4a\\.system_generated\\steps\\122\\output.txt";
  const content = fs.readFileSync(outputTxtPath, 'utf8');
  const data = JSON.parse(content).data || JSON.parse(content);
  
  const wf = data;

  // Find the node
  const nodeIndex = wf.nodes.findIndex(n => n.name === 'Normaliza Mensagem');
  if (nodeIndex === -1) {
    console.error("Node not found!");
    process.exit(1);
  }

  // Update JS Code
  const jsCode = `// Normaliza o payload da Evolution API (messages.upsert) ou do CRM
// e decide se a mensagem deve ser processada.

const raw = $input.item.json;
const body = raw.body ?? raw;

// Novo: Se for evento do CRM (novo_lead_catalogo)
if (body.event === 'novo_lead_catalogo') {
  return {
    json: {
      processar: true,
      motivoDescarte: null,
      telefone: body.phone,
      remoteJid: body.phone + '@s.whatsapp.net',
      nome: body.name,
      mensagem: \`Olá, tenho interesse no produto \${body.product}\`,
      messageId: \`crm_\${Date.now()}\`,
      recebidoEm: new Date().toISOString(),
      EVOLUTION_URL: raw.EVOLUTION_URL,
      EVOLUTION_INSTANCE: raw.EVOLUTION_INSTANCE,
      CRM_URL: raw.CRM_URL,
      CALENDAR_ID: raw.CALENDAR_ID,
    }
  };
}

const data = body.data ?? {};
const key = data.key ?? {};
const msg = data.message ?? {};

const remoteJid = key.remoteJid ?? '';
const fromMe = key.fromMe === true;
const isGrupo = remoteJid.includes('@g.us');
const isStatus = remoteJid.includes('status@broadcast');

// Extrai texto de todos os formatos comuns da Evolution
const texto = (
  msg.conversation ??
  msg.extendedTextMessage?.text ??
  msg.imageMessage?.caption ??
  msg.videoMessage?.caption ??
  msg.buttonsResponseMessage?.selectedDisplayText ??
  msg.listResponseMessage?.title ??
  msg.templateButtonReplyMessage?.selectedDisplayText ??
  ''
).toString().trim();

const temAudio = Boolean(msg.audioMessage);
const telefone = remoteJid.split('@')[0] ?? '';

// Regras de descarte
let motivoDescarte = null;
if (fromMe) motivoDescarte = 'mensagem enviada por nos';
else if (isGrupo) motivoDescarte = 'mensagem de grupo';
else if (isStatus) motivoDescarte = 'status broadcast';
else if (temAudio && !texto) motivoDescarte = 'audio sem transcricao';
else if (!texto) motivoDescarte = 'sem conteudo de texto';
else if (!telefone) motivoDescarte = 'telefone ausente';

return {
  json: {
    processar: motivoDescarte === null,
    motivoDescarte,
    telefone,
    remoteJid,
    nome: data.pushName ?? 'Lead',
    mensagem: texto,
    messageId: key.id ?? '',
    recebidoEm: new Date().toISOString(),
    EVOLUTION_URL: raw.EVOLUTION_URL,
    EVOLUTION_INSTANCE: raw.EVOLUTION_INSTANCE,
    CRM_URL: raw.CRM_URL,
    CALENDAR_ID: raw.CALENDAR_ID,
  },
};`;

  wf.nodes[nodeIndex].parameters.jsCode = jsCode;

  // Make request
  const validWf = {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: wf.settings || {}
  };

  const reqOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': apiKey
    },
    body: JSON.stringify(validWf)
  };

  console.log("Updating workflow...");
  const resp = await fetch(apiUrl, reqOptions);
  
  if (resp.ok) {
    console.log("Workflow updated successfully!");
  } else {
    const errorText = await resp.text();
    console.error("Failed to update workflow:", resp.status, resp.statusText);
    console.error(errorText);
  }
}

updateWorkflow();
