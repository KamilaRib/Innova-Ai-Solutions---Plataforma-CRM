# CRM Backend Implementation Plan - Phase 3: CRM Features

## Phase 3: CRM Dashboard & Features
- [ ] **Task 1: Leads Inventory & Search**
  - [ ] Implement `GET /leads` with pagination and search (name/phone).
  - [ ] Implement `GET /leads/:id` to fetch full history + context.
  - [ ] Patch `Lead.stage_id` for Kanban drag-and-drop.
- [ ] **Task 2: Kanban Infrastructure**
  - [ ] Implement `GET /pipelines/stages` for the current tenant.
  - [ ] Logic to reorder stages (drag-and-drop support).
- [ ] **Task 3: Dashboard & BI (Simplified)**
  - [ ] `GET /dashboard/stats` - Summary of active leads, new leads today, message volume.
  - [ ] `GET /dashboard/usage` - API consumption (OpenAI, WhatsApp) from `UsageLog`.
- [ ] **Task 4: Intelligent Agent Settings (Whitelabel + Mute)**
  - [ ] Implement `GET/PATCH /settings/tenant`.
  - [ ] **Business Logic:** "Silenciar Agente" (If a human sends a message, set `bot_enabled: false` or `bot_paused_until` in `TenantSettings`).
  - [ ] **Business Logic:** "Auto-unpause" hours logic.

## Context
Fase 1 (Base) and Fase 2 (Chat) are complete. Fase 3 builds the management layer around the chat data.

Folder: `c:\Users\kamil\Projects\Antigravity\.worktrees\feat-backend-core\backend`
