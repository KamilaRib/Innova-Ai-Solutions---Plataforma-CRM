const fs = require('fs');

async function fixWorkflow() {
  const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MTA3MTYwYS04YjYxLTQ2MDctYWUyMy1kYjhmODI1NmY0MDYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzgxMzQwNDg2fQ.QK3WMcYwRPQZNtp1uc2_7I88PNTgXoOtSz-joGFP90U";
  const apiUrl = "https://n8n.agency-innova-ai-solutions.cloud/api/v1/workflows/QyBYd0NU7kRskBg7";

  const getReq = await fetch(apiUrl, { headers: { 'X-N8N-API-KEY': apiKey } });
  const wf = await getReq.json();

  const nodeIndex = wf.nodes.findIndex(n => n.name === 'calendar_agendar_sessao');
  if (nodeIndex === -1) {
    console.error("Node calendar_agendar_sessao not found!");
    process.exit(1);
  }

  // Corrigindo a string summary para ter a mesma descricao do description
  // Atual: =Sessao Estrategica - {{ $fromAI('nome_lead', 'Nome do lead que vai participar', 'string') }}
  // Novo: =Sessao Estrategica - {{ $fromAI('nome_lead', 'Nome do lead', 'string') }}
  wf.nodes[nodeIndex].parameters.additionalFields.summary = "=Sessao Estrategica - {{ $fromAI('nome_lead', 'Nome do lead', 'string') }}";

  const validWf = {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: wf.settings || {}
  };

  const reqOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-N8N-API-KEY': apiKey },
    body: JSON.stringify(validWf)
  };

  const resp = await fetch(apiUrl, reqOptions);
  
  if (resp.ok) {
    console.log("Bug fixed successfully!");
  } else {
    console.error("Failed to update workflow:", resp.status, await resp.text());
  }
}

fixWorkflow();
