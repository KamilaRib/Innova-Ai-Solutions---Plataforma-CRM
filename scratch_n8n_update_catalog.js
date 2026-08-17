const fs = require('fs');

async function updateWorkflow() {
  const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MTA3MTYwYS04YjYxLTQ2MDctYWUyMy1kYjhmODI1NmY0MDYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzgxMzQwNDg2fQ.QK3WMcYwRPQZNtp1uc2_7I88PNTgXoOtSz-joGFP90U";
  const apiUrl = "https://n8n.agency-innova-ai-solutions.cloud/api/v1/workflows/QyBYd0NU7kRskBg7";

  // Buscar o workflow online atual (com a nossa modificação anterior)
  const getReq = await fetch(apiUrl, {
    headers: { 'X-N8N-API-KEY': apiKey }
  });
  const data = await getReq.json();
  const wf = data;

  // Find the node
  const nodeIndex = wf.nodes.findIndex(n => n.name === 'Catalogo de Produtos');
  if (nodeIndex === -1) {
    console.error("Node not found!");
    process.exit(1);
  }

  // Update JS Code
  const jsCode = `// Monta o contexto que o agente vai receber.
// EDITE O CATALOGO ABAIXO — e o unico lugar que define o discurso comercial.

const CATALOGO = \`
PRODUTOS DA EMPRESA (INNOVA AI SOLUTIONS)

1) Mentoria de Automação com IA
   - Para quem e: Empreendedores e donos de negócio que querem automatizar processos
   - O que entrega: 4 encontros ao vivo, setup inicial de n8n e CRM
   - Formato: Online via Google Meet
   - Investimento: R$ 2.500,00 à vista ou 12x de R$ 250,00
   - Diferencial: Aplicação prática no negócio do cliente desde o primeiro dia

2) Setup Completo de CRM + Agente de Vendas
   - Para quem e: Empresas que já têm volume de leads e perdem vendas no WhatsApp
   - O que entrega: CRM configurado, Agente de IA treinado com o catálogo, Integração Evolution API
   - Formato: Entrega feita em 15 dias (Done-For-You)
   - Investimento: R$ 5.000,00 (50% entrada, 50% na entrega)
   - Diferencial: Você não precisa fazer nada, entregamos rodando.

OBJECOES COMUNS E COMO RESPONDER
- "Esta caro": Mostrar que o investimento se paga com as vendas que ele está perdendo hoje por falta de atendimento rápido.
- "Preciso pensar": Criar urgência oferecendo um bônus de 1 mês de suporte gratuito se fechar hoje.
- "Nao tenho tempo": Explicar que a automação serve exatamente para liberar o tempo dele.

O QUE NUNCA PROMETER
- Garantia de faturamento ou ROI exato.
- Descontos maiores que 10%.
\`;

const msg = $('Normaliza Mensagem').item.json;
const crm = $input.item.json ?? {};

// O CRM pode devolver objeto, array ou {data:[...]} — normalizamos
const lista = Array.isArray(crm) ? crm : (crm.data ?? crm.clientes ?? (crm.id ? [crm] : []));
const lead = Array.isArray(lista) ? (lista[0] ?? null) : lista;

const existe = Boolean(lead && (lead.id ?? lead.cliente_id));

return {
  json: {
    ...msg,
    catalogo: CATALOGO.trim(),
    leadExiste: existe,
    leadId: existe ? String(lead.id ?? lead.cliente_id) : '',
    leadNome: existe ? (lead.nome ?? msg.nome) : msg.nome,
    etapaAtual: existe ? (lead.etapa ?? lead.stage ?? 'novo') : 'novo',
    resumoCrm: existe
      ? \`Lead ja cadastrado. ID: \${lead.id ?? lead.cliente_id}. Etapa atual: \${lead.etapa ?? lead.stage ?? 'novo'}. Nome: \${lead.nome ?? msg.nome}.\`
      : 'Lead ainda NAO cadastrado no CRM. Cadastre com a ferramenta crm_criar_ou_atualizar_lead assim que tiver nome e telefone.',
    dataHoraAgora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
  },
};`;

  wf.nodes[nodeIndex].parameters.jsCode = jsCode;

  const validWf = {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: wf.settings || {}
  };

  // Make request
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
