import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : My workflow
// Nodes   : 14  |  Connections: 10
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook
// CheckCommand                       if
// GetCrmStats                        httpRequest
// FormatMetricsMessage               code
// SendWhatsappResponse               httpRequest
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
//    → CheckCommand
//      → GetCrmStats
//        → FormatMetricsMessage
//          → SendWhatsappResponse
//     .out(1) → GetLeadContext
//        → AiAgent
//          → AiClassifier
//            → CheckStageChange
//              → UpdateLeadStatus
//                → GoogleCalendar
//
// AI CONNECTIONS
// AiAgent.uses({ ai_languageModel: OpenaiChatModel, ai_memory: Memory, ai_tool: [UpsertCustomerTool] })
// AiClassifier.uses({ ai_languageModel: OpenaiChatModel })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'hsbioJ8U0OmoxXKx',
    name: 'My workflow',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', callerPolicy: 'workflowsFromSameOwner', availableInMCP: false },
})
export class MyWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '80202769-6b94-4ad6-a83e-ae67e6860cc2',
        webhookId: '9ca628b7-b9ae-4edc-9694-0254b3312c4d',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-400, -80],
    })
    Webhook = {
        httpMethod: 'POST',
        path: '9ca628b7-b9ae-4edc-9694-0254b3312c4d',
        options: {},
    };

    @node({
        id: '9ce8fd82-9cb5-4e3a-86b3-de0192372c84',
        name: 'Check Command',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [-150, -80],
    })
    CheckCommand = {
        conditions: {
            options: {
                version: 2,
                caseSensitive: false,
                typeValidation: 'loose',
            },
            conditions: [
                {
                    id: 'is-metrics-slash',
                    leftValue:
                        '={{ $json.body.message?.conversation || $json.body.message?.extendedTextMessage?.text || $json.body.message || $json.body.text || "" }}',
                    rightValue: '/metricas',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                    },
                },
                {
                    id: 'is-metrics',
                    leftValue:
                        '={{ $json.body.message?.conversation || $json.body.message?.extendedTextMessage?.text || $json.body.message || $json.body.text || "" }}',
                    rightValue: 'Métricas',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                    },
                },
            ],
            combinator: 'or',
        },
    };

    @node({
        id: 'f8d387f3-e5d3-4837-975d-384df882d921',
        name: 'Get CRM Stats',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [100, -250],
    })
    GetCrmStats = {
        method: 'GET',
        url: 'https://agency-innova-ai-solutions.cloud/api/leads/stats',
        authentication: 'none',
    };

    @node({
        id: '7d3e23f9-7cc4-4a4e-be89-53e3df774a32',
        name: 'Format Metrics Message',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [330, -250],
    })
    FormatMetricsMessage = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const stats = $input.first().json.data;
const total = stats?.totalLeads || 0;
const ativos = stats?.leadsAtivos || 0;
const ganhos = stats?.leadsGanhos || 0;
const perdidos = stats?.leadsPerdidos || 0;
const mensagens = stats?.totalMessages || 0;

const formattedText = "📊 *MÉTRICAS DO CRM EM TEMPO REAL* 📊\\n\\n" +
  "👤 *Total de Leads:* " + total + "\\n" +
  "⚡ *Leads Ativos (Funil):* " + ativos + "\\n" +
  "🏆 *Leads Ganhos:* " + ganhos + "\\n" +
  "❌ *Leads Perdidos:* " + perdidos + "\\n" +
  "💬 *Mensagens Hoje:* " + mensagens + "\\n\\n" +
  "🕒 _Atualizado às: " + new Date().toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'}) + " (BRT)_";

return [{ json: { formattedText } }];
`,
    };

    @node({
        id: 'b8d92cf8-57fd-4e89-9a2e-83df24ef6c54',
        name: 'Send WhatsApp Response',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [560, -250],
    })
    SendWhatsappResponse = {
        method: 'POST',
        url: '={{ ($env.EVOLUTION_API_URL || "https://evolution.agency-innova-ai-solutions.cloud") + "/message/sendText/" + ($env.EVOLUTION_INSTANCE_NAME || "F64EE7FB7560-4ABD-82FA-2356ADD1AE00") }}',
        sendHeaders: true,
        specifyHeaders: 'json',
        jsonHeaders: '={ "apikey": "{{ $env.EVOLUTION_API_KEY || "innova_secret_key" }}" }',
        sendBody: true,
        contentType: 'json',
        specifyBody: 'json',
        jsonBody:
            '={ "number": "{{ $node["Webhook"].json.body.phone || $node["Webhook"].json.body.from || $node["Webhook"].json.body.key?.remoteJid || $node["Webhook"].json.body.data?.key?.remoteJid }}", "text": "{{ $node["Format Metrics Message"].json.formattedText }}", "textMessage": { "text": "{{ $node["Format Metrics Message"].json.formattedText }}" }, "options": { "delay": 1000, "presence": "composing", "linkPreview": false } }',
    };

    @node({
        id: 'dd46cbb7-7789-4ca7-ac64-bfeda377f016',
        name: 'Get Lead Context',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [100, 50],
    })
    GetLeadContext = {
        url: '={{ ($env.BACKEND_URL || "https://agency-innova-ai-solutions.cloud") + "/api/leads/context/" + ($json.body.phone || $json.body.from) }}',
        options: {},
    };

    @node({
        id: '5ed07a45-8da9-45b8-8f2d-d085de013078',
        name: 'AI Agent',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 3.1,
        position: [330, 50],
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
        position: [400, 250],
    })
    Memory = {
        sessionKey: 'chat_history',
    };

    @node({
        id: '021a8299-8f31-41fa-ac72-4142f7771221',
        name: 'Upsert Customer Tool',
        type: 'n8n-nodes-base.httpRequestTool',
        version: 4.4,
        position: [530, 250],
    })
    UpsertCustomerTool = {
        toolDescription: 'Cria ou atualiza o cadastro de um cliente com Nome, Email, CPF/CNPJ (document) e Endereço.',
        method: 'POST',
        url: '={{ ($env.BACKEND_URL || "https://agency-innova-ai-solutions.cloud") + "/api/customers" }}',
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
        position: [560, 50],
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
        position: [800, 50],
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
        position: [1030, 20],
    })
    UpdateLeadStatus = {
        method: 'PATCH',
        url: '={{ ($env.BACKEND_URL || "https://agency-innova-ai-solutions.cloud") + "/api/leads/" + $node["Get Lead Context"].json.id }}',
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
        position: [1260, 20],
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
        position: [250, 250],
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
        this.Webhook.out(0).to(this.CheckCommand.in(0));
        this.CheckCommand.out(0).to(this.GetCrmStats.in(0));
        this.CheckCommand.out(1).to(this.GetLeadContext.in(0));
        this.GetCrmStats.out(0).to(this.FormatMetricsMessage.in(0));
        this.FormatMetricsMessage.out(0).to(this.SendWhatsappResponse.in(0));
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
