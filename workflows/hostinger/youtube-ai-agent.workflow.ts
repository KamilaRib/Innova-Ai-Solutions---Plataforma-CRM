import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : YouTube AI Poster (Neuroinspira)
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Schedule                           scheduleTrigger
// Postgresselect                     postgres
// Loop                               splitInBatches
// Downloadvideo                      googleDrive                [creds]
// Openaigenerate                     openAi                     [creds]
// Youtubeupload                      youTube                    [creds]
// Postgresupdate                     postgres
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Schedule
//    → Postgresselect
//      → Loop
//        → Downloadvideo
//          → Openaigenerate
//            → Youtubeupload
//              → Postgresupdate
//                → Loop (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'v3xHUqzbsDNBdA3E',
    name: 'YouTube AI Poster (Neuroinspira)',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', callerPolicy: 'workflowsFromSameOwner', availableInMCP: false },
})
export class YoutubeAiPosterNeuroinspiraWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '2ce62627-4152-4a9e-9215-a1c4d8e5f602',
        name: 'Schedule',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.1,
        position: [0, 0],
    })
    Schedule = {
        rule: {
            interval: [
                {
                    field: 'cronExpression',
                    expression: '0 14 * * *',
                },
            ],
        },
    };

    @node({
        id: '286ad935-d96c-4387-b92b-a4cec19b98b3',
        name: 'PostgresSelect',
        type: 'n8n-nodes-base.postgres',
        version: 2.3,
        position: [200, 0],
    })
    Postgresselect = {
        operation: 'executeQuery',
        schema: {
            mode: 'list',
            value: 'public',
        },
        table: {
            mode: 'list',
            value: 'YoutubeAgenda',
        },
        query: 'SELECT * FROM "YoutubeAgenda" WHERE status = \'PENDING\' AND post_date::date <= CURRENT_DATE;',
    };

    @node({
        id: 'b0af7b75-72bd-4abd-b697-dc5d0097ee2c',
        name: 'Loop',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [400, 0],
    })
    Loop = {
        batchSize: 1,
    };

    @node({
        id: 'd2c5aa90-7ec1-418e-a43f-1c8e0616a973',
        name: 'DownloadVideo',
        type: 'n8n-nodes-base.googleDrive',
        version: 3,
        position: [600, 0],
        credentials: { googleDriveOAuth2Api: { id: 'mebgJrPYzadD21hP', name: 'Google Drive account' } },
    })
    Downloadvideo = {
        resource: 'file',
        operation: 'download',
        fileId: {
            mode: 'id',
            value: '={{ $json.video_file_url.match(/d\\/([a-zA-Z0-9_-]+)/)?.[1] || $json.video_file_url.match(/id=([a-zA-Z0-9_-]+)/)?.[1] || $json.video_file_url }}',
        },
    };

    @node({
        id: 'b20aaffb-7630-4a24-8c0e-a2412601f3ce',
        name: 'OpenAiGenerate',
        type: 'n8n-nodes-base.openAi',
        version: 1.1,
        position: [800, 0],
        credentials: { openAiApi: { id: '', name: 'OpenAi account' } },
    })
    Openaigenerate = {
        resource: 'chat',
        operation: 'complete',
        chatModel: 'gpt-4o',
        prompt: {
            messages: [
                {
                    role: 'system',
                    content:
                        'Você é um estrategista viral focado em YOUTUBE SHORTS para o nicho de SAÚDE MENTAL E EMOCIONAL (canal Neuroinspira AI). Mantenha um tom reflexivo, engajador e rápido. Sempre inclua as hashtags #shorts, #saudemental e de neurociência na descrição. Gere sempre um JSON válido com "titulo", "descricao" e "tags" (array de strings).',
                },
                {
                    role: 'user',
                    content: 'Tema do vídeo: {{$node["Loop"].json.theme}}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'c8d42509-fa71-4491-a86b-38d05a0042cf',
        name: 'YouTubeUpload',
        type: 'n8n-nodes-base.youTube',
        version: 1,
        position: [1000, 0],
        credentials: { youTubeOAuth2Api: { id: '', name: 'YouTube account' } },
    })
    Youtubeupload = {
        resource: 'video',
        operation: 'upload',
        title: '={{ JSON.parse($json.message.content).titulo }}',
        playlistId: '',
        channelId: '',
        part: ['snippet', 'status'],
        binaryProperty: 'data',
        options: {
            description: '={{ JSON.parse($json.message.content).descricao }}',
            tags: '={{ JSON.parse($json.message.content).tags }}',
            privacyStatus: 'private',
        },
    };

    @node({
        id: '05977ecb-b733-4b61-b16d-51d330375a9b',
        name: 'PostgresUpdate',
        type: 'n8n-nodes-base.postgres',
        version: 2.3,
        position: [1200, 0],
    })
    Postgresupdate = {
        operation: 'executeQuery',
        schema: {
            mode: 'list',
            value: 'public',
        },
        table: {
            mode: 'list',
            value: 'YoutubeAgenda',
        },
        query: 'UPDATE "YoutubeAgenda" SET status = \'POSTED\' WHERE id = $1;',
        options: {
            queryParameters: '={{ $node["Loop"].json.id }}',
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Schedule.out(0).to(this.Postgresselect.in(0));
        this.Postgresselect.out(0).to(this.Loop.in(0));
        this.Loop.out(0).to(this.Downloadvideo.in(0));
        this.Downloadvideo.out(0).to(this.Openaigenerate.in(0));
        this.Openaigenerate.out(0).to(this.Youtubeupload.in(0));
        this.Youtubeupload.out(0).to(this.Postgresupdate.in(0));
        this.Postgresupdate.out(0).to(this.Loop.in(0));
    }
}
