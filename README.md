# Sweed

Minimal full-stack TypeScript starter for an AI-assisted coding interview.

## Stack

- Bun runtime, package manager, and test runner
- Elysia API on Bun
- PostgreSQL with Kysely and Kysely migrations
- React 19, Vite, Mantine, and TanStack Query
- JWT auth through an HTTP-only cookie
- GitHub Actions CI for install, typecheck, and tests

## Local Setup

```bash
bun install
cp .env.example .env
bun run db:migrate
bun run dev:api
bun run dev:web
```

The web app runs on `http://localhost:5173` and proxies `/api` to `http://localhost:3000`.

## Checks

```bash
bun run typecheck
bun test
```

## Database

Use the home PostgreSQL instance through `DATABASE_URL` for local development. CI intentionally does not depend on that instance.

```bash
bun run db:migrate
bun run db:rollback
bun run db:codegen
```

