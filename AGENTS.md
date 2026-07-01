# Agent Instructions

Read [docs/stack-and-guardrails.md](docs/stack-and-guardrails.md) before making code or architecture changes.

## Routing

- For stack, dependency, architecture, state, testing, migration, CI, or auth decisions, use `docs/stack-and-guardrails.md` as the project source of truth.
- For database work, read the Database and Migrations sections before editing Kysely queries, migrations, or generated DB types.
- For frontend state work, read the Application State section before adding global state, cache behavior, or form handling.
- Keep changes as small vertical slices with a runnable state after each commit.

