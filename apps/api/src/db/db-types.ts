import type { Generated } from "kysely";

export interface Database {
  users: UsersTable;
}

export interface UsersTable {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

