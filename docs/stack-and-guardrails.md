# Stack And Guardrails

## Purpose

Sweed is a 90-minute interview starter. Optimize for a working vertical slice, type safety, and clear boundaries. Do not build a large framework before the product behavior exists.

## Stack

- Runtime and package manager: Bun.
- API: Elysia on Bun.
- Language: TypeScript in strict mode.
- Database: PostgreSQL.
- Query layer: Kysely.
- Migrations: Kysely Migrator.
- DB type generation: `kysely-codegen`.
- Web: React 19 and Vite.
- UI: Mantine.
- Server state and cache: TanStack Query.
- Form state: `@mantine/form`.
- Auth: JWT in an HTTP-only cookie.
- Tests: `bun:test`.
- CI: GitHub Actions with install, typecheck, and tests.

## Architecture

Use small vertical slices.

- Shared request/response schemas live in `packages/shared/src/contracts`.
- API feature code lives in `apps/api/src/features/<feature>`.
- API routes depend on services, services depend on repositories, repositories own DB access.
- Web feature code lives in `apps/web/src/features/<feature>`.
- Web code calls the API through feature-local API hooks backed by TanStack Query.
- The UI must not import API internals or DB code.
- The API must not import web code.
- DB access must stay behind repository boundaries.

## Database And Migrations

- `DATABASE_URL` is for local development and demo.
- `DATABASE_URL_TEST` is reserved for integration tests; tests must not clean or mutate the dev schema.
- Do not run migrations automatically on API startup.
- Migrations must be explicit and reversible where practical.
- Run `bun run db:migrate` before using a fresh database.
- Run `bun run db:codegen` after schema changes so TypeScript follows the real DB schema.

## Auth

- Keep auth minimal: register, login, logout, and current user.
- Store JWT in an HTTP-only cookie.
- Do not store JWT in `localStorage`.
- Keep password hashing and JWT signing inside the auth service.
- Protected routes should read the current user through a single session helper.

## Application State

- Server state belongs in TanStack Query.
- Form state belongs in `@mantine/form`.
- URL state belongs in search params when it affects list filters, sorting, or pagination.
- Temporary UI state belongs in local React state.
- Do not add Redux or Zustand unless a real client-only cross-page state problem appears.
- Do not duplicate `currentUser` in a separate global store; use the `auth.me` query.

## Cache Rules

- Use stable query key factories.
- Prefer targeted invalidation after mutations.
- Avoid broad cache resets unless auth identity changes.
- Do not add persistent browser cache for the interview starter.

## Testing

- Use `bun:test`.
- API route tests should call `app.handle(new Request(...))`; do not bind a port for tests.
- Unit-test services without PostgreSQL when possible.
- Add DB integration tests only behind a separate test database.
- Prefer a few behavior-focused tests over many shallow render tests.

## CI

- CI must not depend on the home PostgreSQL instance.
- The default gate is install, typecheck, and tests.
- Add a PostgreSQL service container later only when DB integration tests are added.

## Commit Discipline

- Commit small runnable vertical slices.
- Keep each commit easy to explain in one sentence.
- Avoid mixing scaffold, feature behavior, refactor, and cleanup in one commit.

