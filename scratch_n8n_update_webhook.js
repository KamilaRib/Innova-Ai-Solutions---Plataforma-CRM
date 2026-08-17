const fs = require('fs');

async function updateWorkflow() {
  const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MTA3MTYwYS04YjYxLTQ2MDctYWUyMy1kYjhmODI1NmY0MDYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzgxMzQwNDg2fQ.QK3WMcYwRPQZNtp1uc2_7I88PNTgXoOtSz-joGFP90U";
  const apiUrl = "https://n8n.agency-innova-ai-solutions.cloud/api/v1/workflows/QyBYd0NU7kRskBg7";

  const getReq = await fetch(apiUrl, {
    headers: { 'X-N8N-API-KEY': apiKey }
  });
  const data = await getReq.json();
  const wf = data;

  // Encontra o Webhook node
  const nodeIndex = wf.nodes.findIndex(n => n.name === 'Webhook Evolution' || n.type === 'n8n-nodes-base.webhook');
  if (nodeIndex === -1) {
    console.error("Node Webhook not found!");
    process.exit(1);
  }

  // Altera o path do Webhook para "CRM"
  wf.nodes[nodeIndex].parameters.path = "CRM";

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
