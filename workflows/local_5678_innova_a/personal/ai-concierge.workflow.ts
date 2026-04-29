import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : AI Agent Concierge & Lead Classification
// Nodes   : 10  |  Connections: 6
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook
// GetLeadContext                     httpRequest
// AiAgent                            agent
// GeminiModel                        lmChatGoogleGemini
// Memory                             memoryBufferWindow
// UpsertCustomerTool                 httpRequestTool
// AiClassifier                       chainLlm
// CheckStageChange                   if
// UpdateLeadStatus                   httpRequest
// GoogleCalendar                     googleCalendar
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → GetLeadContext
//      → AiAgent
//        → AiClassifier
//          → CheckStageChange
//            → UpdateLeadStatus
//              → GoogleCalendar
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'Avv8G0npHyMt64p6',
    name: 'AI Agent Concierge & Lead Classification',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', callerPolicy: 'workflowsFromSameOwner', availableInMCP: false },
})
export class AiAgentConciergeLeadClassificationWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '68719200-1e0c-4835-9449-25e35c6d178d',
        webhookId: '34160047-3549-43c3-a554-b331e885228a',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 1.1,
        position: [0, 0],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'lead-message-v2',
        responseMode: 'onReceived',
    };

    @node({
        id: 'dd46cbb7-7789-4ca7-ac64-bfeda377f016',
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
        id: '5ed07a45-8da9-45b8-8f2d-d085de013078',
        name: 'AI Agent',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 3.1,
        position: [450, 0],
    })
    AiAgent = {
        promptType: 'define',
        text: '={{ $json.body.message || $json.body.text || "Olá" }}',
        options: {
            systemMessage:
                'Você é o Concierge da INNOVA AI. Atenda o cliente, tire dúvidas e capture dados (Nome, Email, CPF/CNPJ, Endereço). Use a ferramenta "upsert_customer" para salvar os dados assim que o cliente os fornecer. Seja premium e educado.',
        },
    };

    @node({
        id: 'c283749b-f5b6-4a14-99cc-cd2349b4d320',
        name: 'Gemini Model',
        type: '@n8n/n8n-nodes-langchain.lmChatGoogleGemini',
        version: 1.1,
        position: [350, 250],
    })
    GeminiModel = {
        modelName: 'models/gemini-1.5-flash',
        options: {
            temperature: 0.7,
        },
    };

    @node({
        id: '4b10c462-3d88-449f-ae0e-3a05579fbe0e',
        name: 'Memory',
        type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
        version: 1.3,
        position: [550, 250],
    })
    Memory = {
        sessionKey: 'chat_history',
    };

    @node({
        id: '021a8299-8f31-41fa-ac72-4142f7771221',
        name: 'Upsert Customer Tool',
        type: 'n8n-nodes-base.httpRequestTool',
        version: 4.4,
        position: [700, 250],
    })
    UpsertCustomerTool = {
        url: '={{ ($env.BACKEND_URL || "http://localhost:5000") + "/api/customers" }}',
        method: 'POST',
        toolDescription: 'Cria ou atualiza o cadastro de um cliente com Nome, Email, CPF/CNPJ (document) e Endereço.',
        sendBody: true,
        contentType: 'json',
        bodyParameters: {
            parameters: [
                {
                    name: 'name',
                    value: '={{ $fromAI("name", "Nome do cliente") }}',
                },
                {
                    name: 'phone',
                    value: '={{ $node["Get Lead Context"].json.phone }}',
                },
                {
                    name: 'email',
                    value: '={{ $fromAI("email", "Email do cliente") }}',
                },
                {
                    name: 'document',
                    value: '={{ $fromAI("document", "CPF ou CNPJ") }}',
                },
                {
                    name: 'address',
                    value: '={{ $fromAI("address", "Endereço completo") }}',
                },
                {
                    name: 'lead_id',
                    value: '={{ $node["Get Lead Context"].json.id }}',
                },
            ],
        },
    };

    @node({
        id: '419d4608-5998-48d7-9d35-fbf2a349a87d',
        name: 'AI Classifier',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.4,
        position: [750, 0],
    })
    AiClassifier = {
        promptType: 'define',
        text: '={{ "Analise o histórico e retorne a fase atual do Kanban (Apenas o nome da fase):\\n\\nHistórico: " + $node["AI Agent"].json.output + "\\n\\nStatus Atual: " + $node["Get Lead Context"].json.pipeline_status }}',
    };

    @node({
        id: '4ce53837-cb24-40d3-b310-06d0221ce7cf',
        name: 'Check Stage Change',
        type: 'n8n-nodes-base.if',
        version: 2,
        position: [950, 0],
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
        id: '7d9e035e-b6cf-4ce7-b11a-3fc4d25a36d0',
        name: 'Update Lead Status',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [1150, -50],
    })
    UpdateLeadStatus = {
        url: '={{ ($env.BACKEND_URL || "http://localhost:5000") + "/api/leads/" + $node["Get Lead Context"].json.id }}',
        method: 'PATCH',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={ "pipeline_status": "{{ $node["AI Classifier"].json.text }}" }',
    };

    @node({
        id: '6c90b952-3e47-4eda-b264-b6f6abdabd67',
        name: 'Google Calendar',
        type: 'n8n-nodes-base.googleCalendar',
        version: 1.3,
        position: [1350, -50],
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
        this.GetLeadContext.out(0).to(this.AiAgent.in(0));
        this.AiAgent.out(0).to(this.AiClassifier.in(0));
        this.AiClassifier.out(0).to(this.CheckStageChange.in(0));
        this.CheckStageChange.out(0).to(this.UpdateLeadStatus.in(0));
        this.UpdateLeadStatus.out(0).to(this.GoogleCalendar.in(0));
    }
}
