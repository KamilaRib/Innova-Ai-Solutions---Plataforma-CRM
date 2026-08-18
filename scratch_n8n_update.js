const fs = require('fs');

async function updateWorkflow() {
  const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MTA3MTYwYS04YjYxLTQ2MDctYWUyMy1kYjhmODI1NmY0MDYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzgxMzQwNDg2fQ.QK3WMcYwRPQZNtp1uc2_7I88PNTgXoOtSz-joGFP90U";
  const apiUrl = "https://n8n.agency-innova-ai-solutions.cloud/api/v1/workflows/QyBYd0NU7kRskBg7";

  // Read original workflow
  const outputTxtPath = "C:\\Users\\kamil\\.gemini\\antigravity-ide\\brain\\8b73a363-5019-4090-bc87-2313d324bf4a\\.system_generated\\steps\\122\\output.txt";
  const content = fs.readFileSync(outputTxtPath, 'utf8');
  const data = JSON.parse(content).data || JSON.parse(content);
  
  const wf = data;

  const nodeIndex = wf.nodes.findIndex(n => n.name === 'Formata Resposta');
  if (nodeIndex !== -1) {
    wf.nodes[nodeIndex].parameters.mode = 'runOnceForAllItems';
  }

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
