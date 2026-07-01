import type { Kysely } from "kysely";
import type { Database } from "../../db/db-types";
import type { CreateUserInput, UserRecord, UserRepository } from "./user-repository";

export class KyselyUserRepository implements UserRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async create(input: CreateUserInput): Promise<UserRecord> {
    const row = await this.db
      .insertInto("users")
      .values({
        id: crypto.randomUUID(),
        email: input.email.toLowerCase(),
        name: input.name,
        password_hash: input.passwordHash
      })
      .returning(["id", "email", "name", "password_hash"])
      .executeTakeFirstOrThrow();

    return toUserRecord(row);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const row = await this.db
      .selectFrom("users")
      .select(["id", "email", "name", "password_hash"])
      .where("email", "=", email.toLowerCase())
      .executeTakeFirst();

    return row ? toUserRecord(row) : null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    const row = await this.db
      .selectFrom("users")
      .select(["id", "email", "name", "password_hash"])
      .where("id", "=", id)
      .executeTakeFirst();

    return row ? toUserRecord(row) : null;
  }
}

function toUserRecord(row: {
  id: string;
  email: string;
  name: string;
  password_hash: string;
}): UserRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash
  };
}

