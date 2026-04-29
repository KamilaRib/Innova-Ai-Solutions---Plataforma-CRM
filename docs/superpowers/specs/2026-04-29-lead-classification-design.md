# Lead Classification Automation Design

## Overview
This design specifies an n8n workflow and corresponding backend API endpoints to automate lead classification and Kanban pipeline movement based on conversation history.

## Goals
- Automatically update `Lead.pipeline_status` in real-time in the **Supabase** database.
- Use AI (LLM) to analyze the entire conversation history.
- **Google Calendar Integration**: When a lead reaches the `Agendamento` stage, the system should facilitate or record the appointment in Google Calendar.
- Ensure the Kanban UI reflects the current negotiation stage.

## Components

### 1. Backend API (Express + Prisma)
We need to implement the following endpoints in `backend/src/routes/leads.routes.js`:

- **GET `/api/leads/context/:phone`**:
  - Purpose: Fetch lead info and recent messages.
  - Returns: `{ id, name, phone, pipeline_status, messages: [...] }`.
- **PATCH `/api/leads/:id`**:
  - Purpose: Update lead fields (specifically `pipeline_status`).
  - Body: `{ pipeline_status: string }`.

### 2. n8n Workflow
- **Trigger**: Webhook triggered by incoming messages (Evolution API or Meta).
- **Node: Get Lead Context**: HTTP Request to the backend.
- **Node: AI Classifier**: 
  - Model: Gemini 1.5 Flash.
  - Input: Recent messages + current status.
  - Logic: Determine if the lead has moved to a new stage.
- **Node: Google Calendar (Conditional)**: 
  - Triggered if status changes to `Agendamento`.
  - Action: Create a calendar event or log the appointment.
- **Node: Update Status**: HTTP Request (PATCH) to the backend if the stage changed.

### 3. Pipeline Stages
The AI will be trained to identify these specific stages:
1. `Início de Atendimento`
2. `Conversando`
3. `Agendamento`
4. `Formulário Enviado`
5. `Follow Up`

## Data Flow
1. User sends message -> Webhook -> n8n.
2. n8n fetches last 10 messages from DB via API.
3. n8n sends history to Gemini.
4. Gemini returns the most appropriate stage.
5. If stage != current stage, n8n calls PATCH API.
6. Frontend (Kanban) refreshes (via polling or manual reload).

## Security
- API calls from n8n to Backend will use a Bearer Token (configured in `.env`).

## Success Criteria
- Leads move automatically in the Kanban as they interact.
- No manual intervention needed for stage updates.
