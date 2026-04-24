import { workflow, node, links } from '@n8n-as-code/transformer';

@workflow({
  name: 'YouTube AI Poster (Neuroinspira)',
  active: false
})
export class YoutubeAiAgent {
  @node({
    name: 'Schedule',
    type: 'n8n-nodes-base.scheduleTrigger',
    version: 1.1,
    position: [0, 0]
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
    name: 'PostgresSelect',
    type: 'n8n-nodes-base.postgres',
    version: 2.3,
    position: [200, 0]
  })
  PostgresSelect = {
    operation: 'executeQuery',
    schema: { mode: 'list', value: 'public' },
    table: { mode: 'list', value: 'YoutubeAgenda' },
    query: 'SELECT * FROM "YoutubeAgenda" WHERE status = \'PENDING\' AND post_date::date <= CURRENT_DATE;'
  };

  @node({
    name: 'Loop',
    type: 'n8n-nodes-base.splitInBatches',
    version: 3,
    position: [400, 0]
  })
  Loop = {
    batchSize: 1
  };

  @node({
    name: 'DownloadVideo',
    type: 'n8n-nodes-base.googleDrive',
    version: 3,
    position: [600, 0],
    credentials: { googleDriveOAuth2Api: { id: '', name: 'Google Drive account' } }
  })
  DownloadVideo = {
    resource: 'file',
    operation: 'download',
    fileId: { mode: 'id', value: '={{ $json.video_file_url.match(/d\\/([a-zA-Z0-9_-]+)/)?.[1] || $json.video_file_url.match(/id=([a-zA-Z0-9_-]+)/)?.[1] || $json.video_file_url }}' }
  };

  @node({
    name: 'OpenAiGenerate',
    type: 'n8n-nodes-base.openAi',
    version: 1,
    position: [800, 0],
    credentials: { openAiApi: { id: '', name: 'OpenAi account' } }
  })
  OpenAiGenerate = {
    resource: 'chat',
    operation: 'create',
    model: 'gpt-4o',
    prompt: {
      messages: [
        {
          role: 'system',
          content: 'Você é um estrategista viral focado em YOUTUBE SHORTS para o nicho de SAÚDE MENTAL E EMOCIONAL (canal Neuroinspira AI). Mantenha um tom reflexivo, engajador e rápido. Sempre inclua as hashtags #shorts, #saudemental e de neurociência na descrição. Gere sempre um JSON válido com "titulo", "descricao" e "tags" (array de strings).'
        },
        {
          role: 'user',
          content: 'Tema do vídeo: {{$node["Loop"].json.theme}}'
        }
      ]
    },
    options: {}
  };

  @node({
    name: 'YouTubeUpload',
    type: 'n8n-nodes-base.youTube',
    version: 1,
    position: [1000, 0],
    credentials: { youTubeOAuth2Api: { id: '', name: 'YouTube account' } }
  })
  YouTubeUpload = {
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
      privacyStatus: 'private'
    }
  };

  @node({
    name: 'PostgresUpdate',
    type: 'n8n-nodes-base.postgres',
    version: 2.3,
    position: [1200, 0]
  })
  PostgresUpdate = {
    operation: 'executeQuery',
    schema: { mode: 'list', value: 'public' },
    table: { mode: 'list', value: 'YoutubeAgenda' },
    query: 'UPDATE "YoutubeAgenda" SET status = \'POSTED\' WHERE id = $1;',
    options: {
      queryParameters: '={{ $node["Loop"].json.id }}'
    }
  };

  @links()
  defineRouting() {
    this.Schedule.out(0).to(this.PostgresSelect.in(0));
    this.PostgresSelect.out(0).to(this.Loop.in(0));
    this.Loop.out(0).to(this.DownloadVideo.in(0));
    this.DownloadVideo.out(0).to(this.OpenAiGenerate.in(0));
    this.OpenAiGenerate.out(0).to(this.YouTubeUpload.in(0));
    this.YouTubeUpload.out(0).to(this.PostgresUpdate.in(0));
    this.PostgresUpdate.out(0).to(this.Loop.in(0));
  }
}
