# White-Label CRM (Node.js Backend) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configurar a estrutura base do Node.js, Prisma ORM e a tabela de Leads para receber os webhooks do n8n.

**Architecture:** Node.js API usando Express, conectado a um banco de dados PostgreSQL via Prisma ORM para isolamento multi-tenant.

**Tech Stack:** Node.js, Express, Prisma, PostgreSQL, Jest.

---

### Task 1: Project Setup & Init

**Files:**
- Create: `backend/package.json`

- [ ] **Step 1: Initialize Node project**
Run: `mkdir backend && cd backend && npm init -y`

- [ ] **Step 2: Install core dependencies**
Run: `cd backend && npm install express cors dotenv && npm install -D jest supertest nodemon prisma`

- [ ] **Step 3: Initialize Prisma**
Run: `cd backend && npx prisma init`
Expected: Prisma folder and .env file created.

- [ ] **Step 4: Commit**
Run: `git add backend/`
Run: `git commit -m "chore: setup node.js backend project structure"`

---

### Task 2: Prisma Schema for CRM Entities

**Files:**
- Modify: `backend/prisma/schema.prisma`

- [ ] **Step 1: Write the schema models**
Add the `User`, `Tenant`, and `Lead` models to `schema.prisma`.

```prisma
// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Tenant {
  id                    String   @id @default(uuid())
  business_name         String
  evolution_webhook_url String?
  created_at            DateTime @default(now())
  users                 User[]
  leads                 Lead[]
}

model User {
  id            String    @id @default(uuid())
  tenant_id     String?
  name          String
  email         String    @unique
  password_hash String
  role          String    @default("AGENT") // ADMIN, CLIENT_OWNER, AGENT
  tenant        Tenant?   @relation(fields: [tenant_id], references: [id])
  messages      Message[]
}

model Lead {
  id                 String    @id @default(uuid())
  tenant_id          String
  name               String
  phone              String
  email              String?
  source             String    // WhatsApp | Website
  pipeline_status    String    @default("Início de Atendimento") // Início de Atendimento, Conversando, Agendamento, Formulário Enviado, Follow Up
  notes              String?
  last_contacted_at  DateTime?
  next_followup_date DateTime?
  is_bot_paused      Boolean   @default(false)
  tenant             Tenant    @relation(fields: [tenant_id], references: [id])
  messages           Message[]
}

model Message {
  id          String   @id @default(uuid())
  lead_id     String
  user_id     String?  // Id da secretária (User) que mandou a msg, se for de agente humano
  sender_type String   // client | agent | bot
  content     String
  created_at  DateTime @default(now())
  lead        Lead     @relation(fields: [lead_id], references: [id])
  user        User?    @relation(fields: [user_id], references: [id])
}
```

- [ ] **Step 2: Format the schema**
Run: `cd backend && npx prisma format`

- [ ] **Step 3: Commit**
Run: `git add backend/prisma/schema.prisma`
Run: `git commit -m "feat(db): create initial schema for multi-tenant CRM"`

---

### Task 3: Express App and Health Check

**Files:**
- Create: `backend/src/app.js`
- Create: `backend/src/server.js`
- Create: `backend/tests/app.test.js`

- [ ] **Step 1: Write the failing test**

```javascript
// backend/tests/app.test.js
const request = require('supertest');
const app = require('../src/app');

describe('App', () => {
  it('should return 200 on /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `cd backend && npx jest`
Expected: FAIL because `app.js` does not exist or has no `/health` route.

- [ ] **Step 3: Write minimal implementation**

```javascript
// backend/src/app.js
const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
```

```javascript
// backend/src/server.js
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
```

- [ ] **Step 4: Run test to verify it passes**
Run: `cd backend && npx jest`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git add backend/src backend/tests`
Run: `git commit -m "feat: add express server setup and health check"`
