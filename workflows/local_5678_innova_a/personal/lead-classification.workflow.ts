import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Lead Classification & Kanban Automation
// Nodes   : 7  |  Connections: 5
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook
// GetLeadContext                     httpRequest
// AiClassifier                       chainLlm
// GeminiModel                        lmChatGoogleGemini
// CheckStageChange                   if
// UpdateLeadStatus                   httpRequest
// GoogleCalendar                     googleCalendar
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → GetLeadContext
//      → AiClassifier
//        → CheckStageChange
//          → UpdateLeadStatus
//            → GoogleCalendar
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'ZRjSfholDPYQT9Co',
    name: 'Lead Classification & Kanban Automation',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', callerPolicy: 'workflowsFromSameOwner', availableInMCP: false },
})
export class LeadClassificationKanbanAutomationWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'd41a4518-fd15-434b-9d5c-923a3362bd39',
        webhookId: '868170ce-261c-426d-b4f5-6de385439d3d',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 1.1,
        position: [0, 0],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'lead-message',
        responseMode: 'onReceived',
    };

    @node({
        id: 'e7fbfe98-3cbb-4616-9c50-f792d4a58995',
        name: 'Get Lead Context',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [200, 0],
    })
    GetLeadContext = {
        url: '={{ $env.BACKEND_URL || "http://localhost:5000" }}/api/leads/context/{{ $json.body.phone || $json.body.from }}',
        method: 'GET',
        authentication: 'none',
    };

    @node({
        id: '0b6877ad-fcb8-4547-9d66-9e2ff7002a9a',
        name: 'AI Classifier',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.4,
        position: [400, 0],
    })
    AiClassifier = {
        promptType: 'define',
        text: '={{ "Instrução: Você é um classificador de leads. Retorne apenas uma das frases: \\"Início de Atendimento\\", \\"Conversando\\", \\"Agendamento\\", \\"Formulário Enviado\\", \\"Follow Up\\". Se houver intenção de marcar reunião, retorne \\"Agendamento\\".\\n\\nHistórico: " + $json.messages.map(m => m.sender_type + ": " + m.content).join("\\n") + "\\n\\nStatus Atual: " + $json.pipeline_status }}',
    };

    @node({
        id: 'c85bb083-a7b0-4676-9115-5c641b52bdea',
        name: 'Gemini Model',
        type: '@n8n/n8n-nodes-langchain.lmChatGoogleGemini',
        version: 1.1,
        position: [400, 200],
    })
    GeminiModel = {
        modelName: 'models/gemini-1.5-flash',
        options: {
            temperature: 0,
        },
    };

    @node({
        id: '7c967ff1-0e43-40ed-8949-dd497a424854',
        name: 'Check Stage Change',
        type: 'n8n-nodes-base.if',
        version: 2,
        position: [650, 0],
    })
    CheckStageChange = {
        conditions: {
            string: [
                {
                    value1: '={{ $json.text }}',
                    operation: 'notEqual',
                    value2: '={{ $node["Get Lead Context"].json.pipeline_status }}',
                },
            ],
        },
    };

    @node({
        id: 'ee6c05d6-11f8-4941-92b0-61bb375957f8',
        name: 'Update Lead Status',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [850, -100],
    })
    UpdateLeadStatus = {
        url: '={{ ($env.BACKEND_URL || "http://localhost:5000") + "/api/leads/" + $node["Get Lead Context"].json.id }}',
        method: 'PATCH',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={ "pipeline_status": "{{ $node["AI Classifier"].json.text }}" }',
    };

    @node({
        id: 'ebc0ce2a-e021-4dad-80a2-69c2565e18d7',
        name: 'Google Calendar',
        type: 'n8n-nodes-base.googleCalendar',
        version: 1.3,
        position: [1100, -100],
    })
    GoogleCalendar = {
        resource: 'event',
        operation: 'create',
        calendar: {
            mode: 'list',
            value: 'primary',
        },
        start: '={{ $now }}',
        end: '={{ $now.plus({ hours: 1 }) }}',
        additionalFields: {
            summary: '={{ "Reunião com Lead: " + $node["Get Lead Context"].json.name }}',
            description: 'Agendado automaticamente pelo Innova CRM.',
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.GetLeadContext.in(0));
        this.GetLeadContext.out(0).to(this.AiClassifier.in(0));
        this.AiClassifier.out(0).to(this.CheckStageChange.in(0));
        this.CheckStageChange.out(0).to(this.UpdateLeadStatus.in(0));
        this.UpdateLeadStatus.out(0).to(this.GoogleCalendar.in(0));
    }
}
