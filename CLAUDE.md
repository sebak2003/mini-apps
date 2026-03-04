# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Turborepo monorepo for deploying independent mini-apps to Vercel. Each app gets its own Vercel project and subdomain (`<name>.vercel.app`). Apps can be temporary (share a link, delete later) or permanent. This is the user's personal "v0" — they say "create me an app for X" and you handle everything.

## Commands

```bash
pnpm build                          # Build all apps
pnpm dev                            # Dev all apps in parallel
pnpm dev:<name>                     # Dev single app (e.g., pnpm dev:punta-cana)
pnpm lint                           # Lint all
pnpm check-types                    # Type-check all

pnpm create-app <name>              # Scaffold new app (auto port, installs deps)
pnpm deploy-app <name>              # Create Vercel project + deploy + assign alias
pnpm db:push <name>                 # Push DB schema changes for an app
pnpm db:studio                      # Open Drizzle Studio (visual DB browser)
```

## Architecture

```
apps/                    # Each app = independent Next.js project
  punta-cana/            # @mini-apps/punta-cana (port 3001)
packages/
  db/                    # @repo/db — Drizzle + Neon client (JIT, no build step)
  env/                   # @repo/env — typed env access (JIT, no build step)
  eslint-config/         # @repo/eslint-config — ESLint v9 flat config
  typescript-config/     # @repo/typescript-config — base.json + nextjs.json
scripts/
  create-app.sh          # Scaffold automation
  deploy.sh              # Deploy automation
  db-push.sh             # Push DB schema for an app
  db-studio.sh           # Open Drizzle Studio
```

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript 5** (strict)
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **pnpm 10** workspaces + **Turborepo v2**
- **Vercel** (one project per app), **Vercel Blob** (shared store for all apps)
- **Neon Postgres** (one project, one DB, schema-per-app isolation)
- **Drizzle ORM** with `neon-http` adapter (serverless/edge optimized)

---

## Operational Workflow: "Create me an app for X"

**This is the complete end-to-end runbook.** When the user asks you to create a mini-app, follow these steps in order. Do NOT ask questions — execute autonomously.

### Step 1: Scaffold

```bash
pnpm create-app <name>
```

This creates `apps/<name>/` with all boilerplate, auto-detects the next port, adds `dev:<name>` script to root `package.json`, and runs `pnpm install`. Both `@repo/env` and `@repo/db` are included as dependencies automatically.

### Step 2: Implement

Replace `apps/<name>/src/app/page.tsx` with the actual app content. The scaffold creates a placeholder — overwrite it entirely.

**Key rules for implementation:**
- Default to `"use client"` for interactive apps
- Use the `frontend-design` skill for UI-heavy apps to get high design quality
- Import shared env: `import { env } from "@repo/env"`
- Path alias `@/*` maps to `./src/*`
- Tailwind v4 is available (imported in `globals.css`)
- If you need additional pages, create them under `src/app/` (App Router)
- If you need API routes, create them under `src/app/api/`

### Step 3: Add dependencies (if needed)

```bash
cd apps/<name> && pnpm add <package>
```

Common additions:
- `@vercel/blob` — for image/file storage
- `drizzle-kit` (devDependency) — only needed if the app uses the database

### Step 4a: Vercel Blob (if the app needs file/image storage)

The shared blob store is already configured. Token is in root `.env.local` and available to all apps automatically.

**Usage in code:**
```ts
import { put, list, del } from "@vercel/blob";

// ALWAYS prefix paths with the app name to keep blobs organized
const blob = await put(`<app-name>/images/${filename}`, file, { access: "public" });

// List blobs for this app
const { blobs } = await list({ prefix: "<app-name>/" });

// Delete
await del(blobUrl);
```

**Blob store details:**
- Store name: `mini-apps-blob`
- Store ID: `store_oIv5wio6aqCLy26p`
- Region: `iad1`
- Access: public
- Token env var: `BLOB_READ_WRITE_TOKEN` (already in `.env.local`)

**After deploying** (Step 6), connect the blob store to the new Vercel project:
```bash
curl -X POST "https://api.vercel.com/v1/storage/stores/store_oIv5wio6aqCLy26p/connections" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"<project-id>","envVarName":"BLOB_READ_WRITE_TOKEN","environments":["production","preview","development"]}'
```

### Step 4b: Database (if the app needs persistent data)

**Architecture:** One Neon project, one database (`neondb`), each app gets its own PostgreSQL schema via `pgSchema()`. All apps share the same `DATABASE_URL`.

**When to use DB vs Blob:**
- **Blob** → images, files, static assets, user uploads
- **DB** → structured data, queries, relationships, CRUD operations

**Step-by-step to add DB to an app:**

1. **Add drizzle-kit as devDependency:**
   ```bash
   cd apps/<name> && pnpm add -D drizzle-kit
   ```

2. **Create the schema** (`apps/<name>/src/db/schema.ts`):
   ```ts
   import { pgSchema } from "@repo/db";
   import { serial, text, timestamp, real } from "drizzle-orm/pg-core";

   // Schema name = app name (use underscores, not hyphens)
   export const schema = pgSchema("app_name");

   export const myTable = schema.table("my_table", {
     id: serial("id").primaryKey(),
     name: text("name").notNull(),
     createdAt: timestamp("created_at").defaultNow(),
   });
   ```

3. **Create drizzle config** (`apps/<name>/drizzle.config.ts`):
   ```ts
   import { config } from "dotenv";
   import { resolve } from "path";
   import { defineConfig } from "drizzle-kit";

   config({ path: resolve(import.meta.dirname, "../../.env.local") });

   export default defineConfig({
     schema: "./src/db/schema.ts",
     out: "./drizzle",
     dialect: "postgresql",
     dbCredentials: {
       url: process.env.DATABASE_URL_UNPOOLED!,
     },
   });
   ```

4. **Push schema to Neon:**
   ```bash
   pnpm db:push <name>
   ```

5. **Use in API routes:**
   ```ts
   import { db } from "@repo/db";
   import { myTable } from "@/db/schema";
   import { desc } from "drizzle-orm";

   export async function GET() {
     const data = await db.select().from(myTable).orderBy(desc(myTable.createdAt));
     return Response.json(data);
   }
   ```

**DB conventions:**
- Schema name = app name with underscores (e.g., `dolar-blue` → `dolar_blue`)
- Use `drizzle-kit push` for development (no migration files — perfect for disposable apps)
- Use `DATABASE_URL_UNPOOLED` for migrations/push (direct connection), `DATABASE_URL` for app queries (pooled)
- Cleanup: `DROP SCHEMA <name> CASCADE` removes all app tables

### Step 5: Build and verify

```bash
pnpm build
```

**MUST pass before deploying.** If it fails, fix the errors and rebuild. Do NOT deploy a broken build.

### Step 6: Deploy

```bash
pnpm deploy-app <name>
```

This script:
1. Creates a Vercel project (or updates if it exists)
2. Sets `rootDirectory: apps/<name>`, `installCommand: pnpm install`, `framework: nextjs`
3. Deploys to production with `vercel --prod`
4. Assigns alias `<name>.vercel.app`

**Requirements for deploy:**
- `VERCEL_TOKEN` must be set in `.env.local`
- `.vercel/project.json` must exist with `orgId` (team ID: `team_s87LpYbPSx5bzUQceJVtHnix`)

### Step 7: Post-deploy env vars

After deploy, add environment variables to the new Vercel project as needed:

- **If app uses Blob:** Connect blob store (see Step 4a)
- **If app uses DB:** Add `DATABASE_URL` to the Vercel project:
  ```bash
  vercel env add DATABASE_URL production --token $VERCEL_TOKEN
  ```
  Or via API:
  ```bash
  curl -X POST "https://api.vercel.com/v10/projects/<project-name>/env" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"key":"DATABASE_URL","value":"<connection-string>","target":["production","preview"],"type":"encrypted"}'
  ```

### Step 8: Report to user

Provide:
- The live URL: `https://<name>.vercel.app`
- What the app does (brief summary)
- Any manual steps needed (e.g., "add data via the admin panel")

---

## Environment Variables

| Variable | Purpose | Location |
|---|---|---|
| `VERCEL_TOKEN` | Deploy script auth | `.env.local` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob access | `.env.local` |
| `DATABASE_URL` | Neon Postgres (pooled) | `.env.local` |
| `DATABASE_URL_UNPOOLED` | Neon Postgres (direct, for migrations) | `.env.local` |

- Root `.env.local` holds ALL shared secrets
- Each app's `next.config.ts` loads root `.env.local` via `dotenv` using `import.meta.dirname` (works because monorepo layout is fixed: `../../.env.local`)
- In production (Vercel), env vars come from project-level or team-level shared settings
- Access env vars: `import { env } from "@repo/env"` → `env.DATABASE_URL` or `env.required("KEY")`

## Neon Database

- **Project:** One shared Neon project for all mini-apps
- **Database:** `neondb` (default)
- **Isolation:** Each app uses its own PostgreSQL schema (`pgSchema('<app_name>')`)
- **ORM:** Drizzle with `neon-http` adapter (serverless-optimized, HTTP-based)
- **Schema push:** `pnpm db:push <app-name>` (uses `drizzle-kit push`)
- **Studio:** `pnpm db:studio` (visual DB browser)
- **Cleanup:** `DROP SCHEMA <app_name> CASCADE` to remove all tables for a deleted app

## Conventions

- **App package name**: `@mini-apps/<name>`
- **Shared package name**: `@repo/<name>`
- **Path alias**: `@/*` → `./src/*` in every app
- **ESLint**: each app re-exports `@repo/eslint-config/nextjs`
- **TypeScript**: each app extends `@repo/typescript-config/nextjs.json`
- **PostCSS**: inline per app (not shared — it's 5 lines)
- **JIT packages**: `@repo/env` and `@repo/db` export raw `.ts` — consumed via `transpilePackages` in each app's `next.config.ts`
- **No tests** configured in this repo

## Deployment Internals

The deploy script (`scripts/deploy.sh`) temporarily swaps `.vercel/project.json` to point to the app being deployed, runs `vercel --prod`, then restores the original. This is because `vercel` CLI reads `.vercel/project.json` to determine which project to deploy to.

**Current `.vercel/project.json`** (org/team context):
```json
{"projectId":"prj_qrsjUt2I0LYtPRRADpISG1dYVoDd","orgId":"team_s87LpYbPSx5bzUQceJVtHnix","projectName":"punta-cana-2026"}
```

The `orgId` (`team_s87LpYbPSx5bzUQceJVtHnix`) is the team ID used for all new projects.

## Adding New Shared Env Vars

1. Add the value to root `.env.local`
2. Add a typed getter in `packages/env/src/index.ts`
3. If needed in production: add to Vercel project settings (per-project or team-level shared)
