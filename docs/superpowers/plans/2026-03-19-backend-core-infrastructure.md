# Backend Core Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the Fastify + TypeScript backend infrastructure with the new multi-tenant prisma schema and plugin-based pattern.

**Architecture:** Use `@fastify/autoload` for modular route/plugin management. Fastify decorators for Prisma and Auth integration. Single global JWT secret with tenant_id payload logic.

**Tech Stack:** Fastify, TypeScript, Prisma, PostgreSQL, jsonwebtoken, bcryptjs, ts-node-dev.

---

### Task 1: Environment & Dependency Setup

**Files:**
- Modify: `backend/package.json`
- Create: `backend/tsconfig.json`

- [ ] **Step 1: Update package.json with Fastify and TS dependencies**
Add scripts for `dev` (ts-node-dev), `build` (tsc), and necessary library updates.
- [ ] **Step 2: Initialize tsconfig.json**
Configure for Node.js 20+ targets with source maps and decorators support.
- [ ] **Step 3: Install dependencies**
Run: `npm install fastify fastify-plugin @fastify/autoload @fastify/cors @fastify/jwt fastify-socket.io @fastify/swagger @fastify/swagger-ui zod @fastify/type-provider-zod`
Run: `npm install -D typescript @types/node @types/bcryptjs ts-node-dev`
- [ ] **Step 4: Commit dependencies**
```bash
git add package.json package-lock.json tsconfig.json
git commit -m "chore: setup fastify and typescript dependencies"
```

### Task 2: Core Application Entry Point

**Files:**
- Create: `backend/src/app.ts` (Fastify instance & plugin registration)
- Create: `backend/src/server.ts` (Main entry point)

- [ ] **Step 1: Scaffold bootstrap app with plugin autoloading**
Use `@fastify/autoload` to load `plugins` and `routes`. Configure `pino` for logging.
- [ ] **Step 2: Create server.ts that listens on PORT**
- [ ] **Step 3: Test server starts**
Run: `npm run dev`
Expected: Server listening on port 3000 (or .env PORT) with "server-started" log.
- [ ] **Step 4: Commit bootstrap**
```bash
git add src/app.ts src/server.ts
git commit -m "feat: initialize fastify bootstrap with autoload"
```

### Task 3: Refined Prisma Schema (Pipelines, White-Label & Audit)

**Files:**
- Modify: `backend/prisma/schema.prisma`

- [ ] **Step 1: Update Schema with missing entities and fields**
  - Add `PipelineStage` model with `order`, `name`, `tenant_id`.
  - Add `AuditLog` model for tracking who accessed which chat and when.
  - Add `TenantSettings` (Configuration) model for "Panic Button" and "Silence on Intervention".
  - Update `Lead` with `country_code`, `ip_address`, `session_start`, and `queue_position`.
  - Update `User` roles: `ADMIN`, `CLIENT_OWNER`, `ATTENDANT`.
- [ ] **Step 2: Run Prisma Generate**
Run: `npx prisma generate`
Expected: PASS
- [ ] **Step 3: Run DB Push (Migration)**
Run: `npx prisma db push` (Use for development, ensures DB is in sync)
Expected: PASS 
- [ ] **Step 4: Commit schema changes**
```bash
git add prisma/schema.prisma
git commit -m "feat: update schema with pipelines, audit and whitelabel support"
```

### Task 4: Global Core Plugins (Prisma & Auth Decorators)

**Files:**
- Create: `backend/src/plugins/prisma.ts`
- Create: `backend/src/plugins/auth.ts`

- [ ] **Step 1: Implement Prisma plugin as a Fastify Decorator**
Allows accessing `fastify.prisma` globally.
- [ ] **Step 2: Implement Auth plugin using @fastify/jwt**
Configure JWT with tenant isolation logic and a dedicated `authenticate` decorator.
- [ ] **Step 3: Write a test route to verify decorators**
Create `src/routes/health.ts` and test `fastify.prisma` accessibility.
- [ ] **Step 4: Commit plugins**
```bash
git add src/plugins/prisma.ts src/plugins/auth.ts
git commit -m "feat: add prisma and auth decorators"
```

### Task 5: Porting Login Controller to Fastify

**Files:**
- Create: `backend/src/routes/auth/index.ts`
- Create: `backend/src/controllers/auth.controller.ts`

- [ ] **Step 1: Implementation of Zod schemas for Login Validation**
- [ ] **Step 2: Port existing Login logic (compare bcrypt hash, issue JWT)**
Ensure JWT payload includes `tenant_id` and `role`.
- [ ] **Step 3: Manual Test Login Flow**
Run: `curl -X POST http://localhost:3000/auth/login ...`
Expected: 200 OK with valid JWT Token.
- [ ] **Step 4: Commit login port**
```bash
git add src/routes/auth/index.ts src/controllers/auth.controller.ts
git commit -m "feat: port auth routes to fastify"
```
