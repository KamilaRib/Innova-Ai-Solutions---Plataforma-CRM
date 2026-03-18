# Projeto: White-Label CRM (Atendimento n8n) - Design Spec
**Data:** 2026-03-18

## 1. Visão Geral
Sistema de CRM no estilo Múltiplos Inquilinos (Multi-Tenant SaaS White-Label) focado no fluxo de atendimento automatizado via WhatsApp (Evolution API) e capturas de Site. Orquestrado inteiramente com inteligência do **n8n** conectada a uma API própria em Node.js com painel Frontend (React).

## 2. Arquitetura e Stack Tecnológica
*   **Backend:** Node.js (com Express ou Fastify), Autenticação JWT e WebSockets (Socket.io) para atualizações em tempo real.
*   **Banco de Dados:** PostgreSQL interligado através de um ORM (Prisma ou TypeORM) com separação de dados baseada em `tenant_id` (Empresas/Clientes).
*   **Frontend Web:** React.js consumindo a API Node.js e construindo Dashboards Administrativos e Quadros Kanban.
*   **Integração (Motor Principal):** n8n e Evolution API (WhatsApp). 

## 3. Entidades Core (Modelagem de Dados de Alta Escalabilidade)
A regra de ouro na modelagem é o isolamento em todas as tabelas operacionais via `tenant_id` (Id da Empresa/Cliente):
1.  **Users:** `id`, `tenant_id` (Nullo se for o Sócio da Agência), `name`, `email`, `password_hash`, `role` (ADMIN=Sócio Geral, CLIENT_OWNER=Dono do Tenant, AGENT=Secretária/Operador).
2.  **Tenants (Empresas Clientes):** `id`, `business_name`, `evolution_webhook_url`, `created_at`.
3.  **Leads (Contatos no Kanban):** `id`, `tenant_id` (A que empresa esse lead pertence), `name`, `phone`, `email`, `source` (WhatsApp | Website), `pipeline_status` (Ex: Novo, Em Atendimento, Retorno, Ganho), `notes`, `last_contacted_at`, `next_followup_date`.

## 4. Fluxo de Integração (n8n <=> Node.js)
1.  **Entrada do Lead:** Mensagem do Evolution API chega -> n8n processa -> n8n envia um "Webhook POST" p/ API Node.js do CRM -> API insere no PostgreSQL daquela empresa.
2.  **Atualização em Tempo Real (WebSockets):** Instantaneamente a API Node.js envia um sinal ao Frontend React. A secretária que já estiver com a tela do Kanban aberta vê o card do celular (Lead) criar vida e mover-se/sincronizar sem precisar apertar (F5).
3.  **Classificação de Máquina (Classificação de IA):** A lógica de fluxos do n8n pode atuar como um termômetro prévio (Hot/Cold) e enviar etiquetas de classificação pro CRM, populando automaticamente o Kanban antes de o humano atuar.

## 5. Follow-ups Automáticos Ativos (via CRON no n8n)
*   **O Gatilho da Secretária:** A Secretária arrasta um lead no Kanban para uma coluna ou preenche uma anotação, e o sistema registra no banco a respectiva data (`next_followup_date`).
*   **A Rotina Autônoma:** O n8n possui uma árvore de ações com nó de gatilho por tempo (*cron schedule*). A cada hora/dia, ele consulta internamente a API do Node.js: *"Quais Leads passaram da hora do follow-up estipulado e constam pendentes?"*.
*   O n8n coordena com a **Evolution API** e envia as mensagens pré-definidas (nurture). Ao finaliza-las, bate na API do Node reportando o sucesso. O ciclo se reinicia e o Kanban pisca novamente de forma atualizada.

## 6. Telas e Isolamento Multicamadas (White-Label)
*   **Visão Sócio (Seu Master Panel):** Isolado do ruído operacional. Apenas visão macro: Faturamento total do seu SaaS, volume processado de mensagens na sua infra, clientes (Tenants) ativos.
*   **Visão Cliente (Owner Workspace):** Um gestor acessando o CRM de sua própria empresa via marca branca. Terá acesso aos relatórios do seu funil e performance dos seus *Agents*.
*   **Visão Agent (A Secretária):** Interface puramente utilitária/operacional. Impossibilitada de ver dashboards de negócio. Tem acesso unicamente ao **Quadro Kanban**, campos de controle, edição de Status dos seus leads, agendamento de rotinas e aprovação das respostas programadas.
