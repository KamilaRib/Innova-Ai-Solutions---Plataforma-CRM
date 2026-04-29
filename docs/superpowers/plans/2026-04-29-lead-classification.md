# Lead Classification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an n8n workflow for real-time lead classification and create the necessary backend API endpoints (GET/PATCH) to support it.

**Architecture:** n8n acts as the orchestrator triggered by messages, Gemimi 1.5 Flash classifies the conversation, and the Backend API persists the new stage in the database.

**Tech Stack:** n8n (TypeScript), Express, Prisma (PostgreSQL), Gemini AI.

---

### Task 1: Backend - Lead Routes & Controller

**Files:**
- Create: `backend/src/routes/leads.routes.js`
- Create: `backend/src/controllers/leads.controller.js`
- Modify: `backend/src/app.js`

- [ ] **Step 1: Create Leads Controller**
Implement functions to get lead context by phone and update lead status.

- [ ] **Step 2: Create Leads Routes**
Define `GET /by-phone/:phone` and `PATCH /:id`.

- [ ] **Step 3: Register Routes in app.js**
Add `app.use('/api/leads', leadsRoutes)`.

- [ ] **Step 4: Verify with Curl**
Run: `curl http://localhost:3000/api/leads/by-phone/123456`
Expected: 200 OK or 404 (if not found).

- [ ] **Step 5: Commit**

### Task 2: n8n - Lead Classification Workflow

**Files:**
- Create: `workflows/local_5678_innova_a/personal/lead-classification.workflow.ts`

- [ ] **Step 1: Search for necessary nodes**
Use `n8nac skills search` for `webhook`, `httpRequest`, `lmChatGoogleGemini`.

- [ ] **Step 2: Scaffold Workflow File**
Create the `.workflow.ts` file with the Trigger and HTTP nodes.

- [ ] **Step 3: Configure AI Node**
Add the Gemini node with the classification prompt defined in the spec.

- [ ] **Step 4: Add Google Calendar Node**
Configure the Google Calendar node to create an event when the stage is `Agendamento`.

- [ ] **Step 5: Validate Workflow**
Run: `npx --yes n8nac skills validate workflows/local_5678_innova_a/personal/lead-classification.workflow.ts`

- [ ] **Step 6: Push & Verify**
Run: `npx --yes n8nac push workflows/local_5678_innova_a/personal/lead-classification.workflow.ts --verify`

- [ ] **Step 7: Commit**

### Task 3: Integration Test

- [ ] **Step 1: Mock Incoming Message**
Use `n8nac test <id> --prod` with a payload simulating a lead message.

- [ ] **Step 2: Verify DB Update**
Check if the lead status changed in the database.

- [ ] **Step 3: Commit**
