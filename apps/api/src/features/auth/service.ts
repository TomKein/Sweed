import type { AuthUser, LoginRequest, RegisterRequest } from "@sweed/shared";
import { issueSessionToken, verifySessionToken } from "./jwt";
import type { UserRecord, UserRepository } from "./user-repository";

export class DuplicateEmailError extends Error {
  constructor() {
    super("Email is already registered");
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
  }
}

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly jwtSecret: Uint8Array
  ) {}

  async register(input: RegisterRequest): Promise<{ user: AuthUser; token: string }> {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new DuplicateEmailError();
    }

    const passwordHash = await Bun.password.hash(input.password, {
      algorithm: "bcrypt",
      cost: 10
    });

    const user = await this.users.create({
      email: input.email,
      name: input.name,
      passwordHash
    });

    return {
      user: toAuthUser(user),
      token: await issueSessionToken({ userId: user.id, email: user.email }, this.jwtSecret)
    };
  }

  async login(input: LoginRequest): Promise<{ user: AuthUser; token: string }> {
    const user = await this.users.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await Bun.password.verify(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user: toAuthUser(user),
      token: await issueSessionToken({ userId: user.id, email: user.email }, this.jwtSecret)
    };
  }

  async getSessionUser(token: string): Promise<AuthUser | null> {
    const claims = await verifySessionToken(token, this.jwtSecret);
    if (!claims) {
      return null;
    }

    const user = await this.users.findById(claims.userId);
    return user ? toAuthUser(user) : null;
  }
}

function toAuthUser(user: UserRecord): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name
  };
}

