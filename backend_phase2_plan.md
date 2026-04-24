# CRM Backend Implementation Plan - Phase 2: Chat Gateway

## Phase 2: Chat Gateway & Business Logic
- [ ] **Task 1: Socket.io Plugin Setup**
  - [ ] Implement `src/plugins/socket.ts` using `fastify-socket.io`.
  - [ ] Configure middleware for JWT authentication on socket connections.
  - [ ] Broadcaster helper for emitting events (new message, lead status change).
- [ ] **Task 2: WhatsApp Webhook Receptor (Meta)**
  - [ ] Implement `src/routes/webhooks.ts`.
  - [ ] Verification logic for Meta's `hub.verify_token`.
  - [ ] Parser for `messages`, `contacts` and `statuses`.
- [ ] **Task 3: Message Handling & Lead Persistence**
  - [ ] Logic to check if lead exists by phone.
  - [ ] Auto-link message to Tenant based on `webhook` callback (from metadata or dedicated URL).
  - [ ] Save to [Message](file:///c:/Users/kamil/Projects/Antigravity/.agents/skills/brainstorming/scripts/server.cjs#222-237) table.
- [ ] **Task 4: Live Chat Interaction**
  - [ ] Route `POST /chat/send` to send messages via WhatsApp Cloud API.
  - [ ] Broadcast message to UI via Socket.io.
  - [ ] Update `Lead.last_contacted_at`.

## Context
Phase 1 foundation is working (Prisma, Auth, Bootstrap). Phase 2 focuses on making the chat "live" and integrated with WhatsApp.

Work from: `c:\Users\kamil\Projects\Antigravity\.worktrees\feat-backend-core\backend`
