import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Google Multimodal Agent (Veo, Imagen & Skills)
// Nodes   : 6  |  Connections: 1
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ChatTrigger                        chatTrigger
// AiAgent                            agent
// GeminiChatModel                    lmChatGoogleGemini         [creds]
// Memory                             memoryBufferWindow
// SkillVeo3Video                     toolHttpRequest
// SkillImagen3Photo                  toolHttpRequest
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ChatTrigger
//    → AiAgent
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'oZR5jgwvjDhmMwcd',
    name: 'Google Multimodal Agent (Veo, Imagen & Skills)',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class GoogleMultimodalAgentVeoImagenSkillsWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '7ff9a433-1f2e-46d8-b45a-bfd41cdc2389',
        webhookId: '398acde2-b083-4ea9-b623-69689b2d1bc2',
        name: 'Chat Trigger',
        type: '@n8n/n8n-nodes-langchain.chatTrigger',
        version: 1.1,
        position: [0, 0],
    })
    ChatTrigger = {};

    @node({
        id: '16c996f0-7094-445d-8d4a-fc0318c9951f',
        name: 'AI Agent',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 1.6,
        position: [200, 0],
    })
    AiAgent = {
        promptType: 'define',
        text: '={{ $json.chatInput }}',
        hasOutputParser: false,
        options: {
            systemMessage:
                'Você é um Super Agente Criativo conectado ao ecossistema Google Cloud. Você pode gerar vídeos (Google Veo3) e imagens fotorealistas (Google Imagen 3) do Vertex AI chamando as ferramentas respectivas. Seja conciso, responda em português.',
        },
    };

    @node({
        id: '9bcd7940-977f-45ed-ad07-966d180b2e00',
        name: 'Gemini Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatGoogleGemini',
        version: 1.1,
        position: [200, 200],
        credentials: { googleApi: { id: '', name: 'Google Workspace/GCP' } },
    })
    GeminiChatModel = {
        modelName: 'models/gemini-1.5-pro-latest',
        options: {},
    };

    @node({
        id: '68307cda-a909-4e7e-b366-b13ef0624e46',
        name: 'Memory',
        type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
        version: 1.3,
        position: [300, 200],
    })
    Memory = {};

    @node({
        id: 'a39c2343-504b-4447-bc51-c08c3217d339',
        name: 'Skill: Veo3 Video',
        type: '@n8n/n8n-nodes-langchain.toolHttpRequest',
        version: 1.1,
        position: [400, 300],
    })
    SkillVeo3Video = {
        toolName: 'gerar_video_veo3',
        toolDescription:
            'Use esta ferramenta para gerar um vídeo usando a IA Google Veo3. O input deve ser o prompt descritivo da cena física a ser gerada.',
        method: 'POST',
        url: 'https://us-central1-aiplatform.googleapis.com/v1/projects/SEU_PROJECT_ID/locations/us-central1/publishers/google/models/veo-1.0:predict',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={"instances":[{"prompt":"{{$fromAI(\'prompt\')}}"}]}',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'googleApi',
    };

    @node({
        id: '611b2e69-17c8-4510-901d-31ed33859258',
        name: 'Skill: Imagen 3 Photo',
        type: '@n8n/n8n-nodes-langchain.toolHttpRequest',
        version: 1.1,
        position: [500, 300],
    })
    SkillImagen3Photo = {
        toolName: 'gerar_foto_imagen3',
        toolDescription:
            'Use esta ferramenta para gerar uma imagem ultrarrealista usando a IA Google Imagen 3 (Vertex AI). O input deve ser o prompt visual em inglês.',
        method: 'POST',
        url: 'https://us-central1-aiplatform.googleapis.com/v1/projects/SEU_PROJECT_ID/locations/us-central1/publishers/google/models/imagegeneration@006:predict',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={"instances":[{"prompt":"{{$fromAI(\'prompt\')}}"}],"parameters":{"sampleCount":1}}',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'googleApi',
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ChatTrigger.out(0).to(this.AiAgent.in(0));
    }
}
