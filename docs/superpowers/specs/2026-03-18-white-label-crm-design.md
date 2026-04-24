# Projeto: White-Label CRM (Atendimento n8n) - Design Spec
**Data:** 2026-03-18

## 1. Visão Geral
Sistema de CRM no estilo Múltiplos Inquilinos (Multi-Tenant SaaS White-Label) focado no fluxo de atendimento automatizado via **API Oficial do WhatsApp Cloud** e capturas de Site. Orquestrado inteiramente com inteligência do **n8n** conectada a uma API própria em Node.js com painel Frontend (React).

## 2. Arquitetura e Stack Tecnológica (Finalizada)
*   **Backend:** Node.js com **Fastify e TypeScript**, Autenticação JWT e **WebSockets (Socket.io)** para atualizações em tempo real (Kanban/Chat).
*   **Banco de Dados:** PostgreSQL via **Prisma ORM** com isolamento por `tenant_id`.
*   **Frontend Web:** React.js consumindo a API Fastify, com suporte a White-Label (Cores e Logos dinâmicas).
*   **Integração Hub Central:** A API Node.js/Fastify atua como um **Gateway Central** para a Meta. Ela recebe os Webhooks, identifica o Tenant e repassa ao n8n, garantindo validação e segurança centralizada.
*   **Documentação (Agnóstica):** API RESTful documentada com **Swagger (OpenAPI)** gerado automaticamente para facilitar conexões externas e n8n.

## 3. Entidades Core (Modelagem de Dados de Alta Escalabilidade)
A regra de ouro na modelagem é o isolamento em todas as tabelas operacionais via `tenant_id` (Id da Empresa/Cliente):
1.  **Users:** `id`, `tenant_id` (Nulo se for o Sócio da Agência), `name`, `email`, `password_hash`, `role` (ADMIN=Sócio Geral, CLIENT_OWNER=Dono do Tenant, ATTENDANT=Atendente para recepção).
1a. **PipelineStages:** `id`, `tenant_id`, `name`, `order` (Permite que cada Cliente/Tenant crie seu próprio funil visual no Kanban).
2.  **Tenants (Empresas Clientes):** `id`, `business_name`, `logo_url`, `primary_color`, `secondary_color`, `whatsapp_phone_number_id`, `whatsapp_access_token`, `whatsapp_verify_token`, `created_at` (Chaves isoladas por cliente).
3.  **Leads (Contatos no Kanban):** `id`, `tenant_id` (A que empresa esse lead pertence), `name`, `phone`, `email`, `source` (WhatsApp | Website), `stage_id` (FK para PipelineStages), `notes`, `last_contacted_at`, `next_followup_date`.
4.  **Messages (Histórico de Chats):** `id`, `lead_id`, `sender_type` (client | agent | bot), `content`, `created_at` (Necessário para a funcionalidade de "Intervenção Manual" da secretária no histórico).

## 4. Fluxo de Integração (HUB Central Node.js <=> n8n)
1.  **HUB Central (Gateway):** A mensagem da API Oficial do WhatsApp chega (Webhook Meta) -> API Node.js valida o `phone_number_id` para identificar o Tenant -> API Node.js repassa via POST p/ n8n.
2.  **Segurança n8n:** O n8n utiliza uma **Chave de API de Sistema Geral** para se autenticar e reportar dados de volta para a nossa API Fastify.
3.  **Atualização em Tempo Real (WebSockets):** Instantaneamente a API Node.js envia sinal via Socket.io ao Frontend React. A secretária vê o card do Lead mover-se no Kanban customizado sem F5.
4.  **Bot vs Humano (Auto-Unpause):** Se a secretária intervir (Modo Humano), a flag `is_bot_paused` é ativada. Um **Timer Automático** (ex: 6h ou 24h) ou inatividade despausa o robô para evitar que leads fiquem sem resposta caso o humano esqueça de retornar.

## 5. Follow-ups Automáticos Ativos (via CRON no n8n)
*   **O Gatilho da Secretária:** A Secretária arrasta um lead no Kanban para uma coluna ou preenche uma anotação, e o sistema registra no banco a respectiva data (`next_followup_date`).
*   **A Rotina Autônoma:** O n8n possui uma árvore de ações com nó de gatilho por tempo (*cron schedule*). A cada hora/dia, ele consulta internamente a API do Node.js: *"Quais Leads passaram da hora do follow-up estipulado e constam pendentes?"*.
*   O n8n coordena com a **API do WhatsApp Cloud** mandando as requisições de resposta e envia as mensagens pré-definidas (nurture). Ao finaliza-las, bate na API do Node reportando o sucesso. O ciclo se reinicia e o Kanban pisca novamente de forma atualizada.

## 6. Telas (Menu do Sistema)
O painel (Frontend React) terá a seguinte estrutura principal de navegação para os Clientes:
*   **Dashboard:** Visão macro, relatórios e métricas de funil/atendimento.
*   **Kanban:** O quadro de fluxo visual com as colunas interativas.
*   **Leads:** Listagem tabular para consultar a base de contatos massivamente.
*   **Chats (Intervenção Manual):** Interface estilo **WhatsApp Web** clássico para intervenção rápida:
    *   **Barra Lateral (Lista):** Conversas ativas com busca e indicação de novas mensagens.
    *   **Painel Central (Histórico):** Bolhas de chat seguindo o padrão visual do WhatsApp (Verde/Cinza).
    *   **Info do Lead (Painel Lateral):** Onde exibimos os dados extras: IP/País, Nome do Atendente Logado (**Histórico de Acesso para rastreabilidade**), Tempo de Sessão, Fila de Espera, Variáveis/Constantes do n8n e Canal Ativo.
    *   **Pausa Inteligente:** Ao enviar mensagem, o `bot_paused = true` é ativado com o Timer de retorno automático.
*   **Follow Up:** Painel ou visão focada nos leads atrasados / para retorno no dia.
*   **Agendamento:** Gestão de compromissos e calendário.
*   **Configurações:** Setup da conta (Nome, Credenciais do Meta/WhatsApp Cloud API). E as abas principais:
    *   **Gestão de Equipe:** Cadastro e gerenciamento de acessos individuais para **Atendentes/Funcionários** da empresa.
    *   **Configurações do Robô (IA):**
        *   **Desligar Atendimento (Geral):** Botão para desativar toda a automação da empresa. ("O agente será desligado e não enviará nenhuma mensagem").
        *   **Silenciar ao Intervir:** Opção para pausar o robô no momento em que o atendente envia a primeira mensagem. ("O agente será desligado com a primeira mensagem do atendente e não enviará mensagem").
    *   **Área de Integrações / n8n:** Onde a nossa API flexível permitirá inputar os endereços dos Webhooks do n8n para plugar ou customizar regras.


