import type { CreateUserInput, UserRecord, UserRepository } from "../features/auth/user-repository";

export class MemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, UserRecord>();

  async create(input: CreateUserInput): Promise<UserRecord> {
    const user: UserRecord = {
      id: crypto.randomUUID(),
      email: input.email.toLowerCase(),
      name: input.name,
      passwordHash: input.passwordHash
    };

    this.users.set(user.id, user);
    return user;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const normalizedEmail = email.toLowerCase();
    return Array.from(this.users.values()).find((user) => user.email === normalizedEmail) ?? null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    return this.users.get(id) ?? null;
  }
}

