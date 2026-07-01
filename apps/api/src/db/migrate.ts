import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileMigrationProvider, Migrator } from "kysely/migration";
import { loadEnv } from "../config/env";
import { createDatabase } from "./database";

const direction = process.argv[2];

if (direction !== "up" && direction !== "down") {
  console.error("Usage: bun src/db/migrate.ts <up|down>");
  process.exit(1);
}

const env = loadEnv();
const db = createDatabase(env.DATABASE_URL);
const migrationFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations");

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder
  })
});

const result = direction === "up"
  ? await migrator.migrateToLatest()
  : await migrator.migrateDown();

for (const migration of result.results ?? []) {
  if (migration.status === "Success") {
    console.log(`${migration.migrationName}: success`);
  }

  if (migration.status === "Error") {
    console.error(`${migration.migrationName}: error`);
  }
}

if (result.error) {
  console.error(result.error);
  await db.destroy();
  process.exit(1);
}

await db.destroy();
