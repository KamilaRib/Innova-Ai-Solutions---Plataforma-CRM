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
// AiAgent                            agent                      [AI]
// Memory                             memoryBufferWindow         [ai_memory]
// UpsertCustomerTool                 httpRequestTool            [ai_tool]
// AiClassifier                       chainLlm                   [AI]
// CheckStageChange                   if
// UpdateLeadStatus                   httpRequest
// GoogleCalendar                     googleCalendar
// OpenaiChatModel                    lmChatOpenAi               [creds] [ai_languageModel] [ai_languageModel]
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
//
// AI CONNECTIONS
// AiAgent.uses({ ai_languageModel: OpenaiChatModel, ai_memory: Memory, ai_tool: [UpsertCustomerTool] })
// AiClassifier.uses({ ai_languageModel: OpenaiChatModel })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'VJs1ScucIVdIneHi',
    name: 'AI Agent Concierge & Lead Classification',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: true, callerPolicy: 'workflowsFromSameOwner' },
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
        options: {},
    };

    @node({
        id: 'dd46cbb7-7789-4ca7-ac64-bfeda377f016',
        name: 'Get Lead Context',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [240, 0],
    })
    GetLeadContext = {
        url: '={{ ($env.BACKEND_URL || "https://innovaaisolutions.com.br") + "/api/leads/context/" + ($json.body.phone || $json.body.from) }}',
        options: {},
    };

    @node({
        id: '5ed07a45-8da9-45b8-8f2d-d085de013078',
        name: 'AI Agent',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 3.1,
        position: [464, 0],
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
        id: '4b10c462-3d88-449f-ae0e-3a05579fbe0e',
        name: 'Memory',
        type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
        version: 1.3,
        position: [544, 224],
    })
    Memory = {
        sessionKey: 'chat_history',
    };

    @node({
        id: '021a8299-8f31-41fa-ac72-4142f7771221',
        name: 'Upsert Customer Tool',
        type: 'n8n-nodes-base.httpRequestTool',
        version: 4.4,
        position: [672, 224],
    })
    UpsertCustomerTool = {
        toolDescription: 'Cria ou atualiza o cadastro de um cliente com Nome, Email, CPF/CNPJ (document) e Endereço.',
        method: 'POST',
        url: '={{ ($env.BACKEND_URL || "https://innovaaisolutions.com.br") + "/api/customers" }}',
        sendBody: true,
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
        options: {},
    };

    @node({
        id: '419d4608-5998-48d7-9d35-fbf2a349a87d',
        name: 'AI Classifier',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.4,
        position: [752, 0],
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
        position: [1088, 0],
    })
    CheckStageChange = {
        conditions: {
            options: {
                version: 2,
                caseSensitive: true,
                typeValidation: 'loose',
            },
            conditions: [
                {
                    id: 'stage-changed',
                    leftValue: '={{ $json.text }}',
                    rightValue: '={{ $node["Get Lead Context"].json.pipeline_status }}',
                    operator: {
                        type: 'string',
                        operation: 'notEquals',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '7d9e035e-b6cf-4ce7-b11a-3fc4d25a36d0',
        name: 'Update Lead Status',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [1344, -32],
    })
    UpdateLeadStatus = {
        method: 'PATCH',
        url: '={{ ($env.BACKEND_URL || "https://innovaaisolutions.com.br") + "/api/leads/" + $node["Get Lead Context"].json.id }}',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={ "pipeline_status": "{{ $node["AI Classifier"].json.text }}" }',
        options: {},
    };

    @node({
        id: '6c90b952-3e47-4eda-b264-b6f6abdabd67',
        name: 'Google Calendar',
        type: 'n8n-nodes-base.googleCalendar',
        version: 1.3,
        position: [1584, -32],
    })
    GoogleCalendar = {
        calendar: {
            mode: 'list',
            value: 'primary',
        },
        end: '={{ $now.plus({ hours: 1 }) }}',
        additionalFields: {
            description: 'Agendado automaticamente pelo Innova CRM.',
            summary: '={{ "Reunião com Lead: " + $node["Get Lead Context"].json.name }}',
        },
    };

    @node({
        id: '96baaff7-163c-413a-96c9-0ef91c2ff934',
        name: 'OpenAI Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [384, 224],
        credentials: { openAiApi: { id: 'qkfeOXkBjp68AZvf', name: 'OpenAi account' } },
    })
    OpenaiChatModel = {
        model: {
            __rl: true,
            value: 'gpt-4o',
            mode: 'list',
            cachedResultName: 'gpt-4o',
        },
        builtInTools: {},
        options: {},
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

        this.AiAgent.uses({
            ai_languageModel: this.OpenaiChatModel.output,
            ai_memory: this.Memory.output,
            ai_tool: [this.UpsertCustomerTool.output],
        });
        this.AiClassifier.uses({
            ai_languageModel: this.OpenaiChatModel.output,
        });
    }
}
