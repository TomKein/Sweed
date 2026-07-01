import { describe, expect, test } from "bun:test";
import { MemoryUserRepository } from "../../test/memory-user-repository";
import { AuthService, DuplicateEmailError, InvalidCredentialsError } from "./service";

const secret = new TextEncoder().encode("test-secret-with-at-least-32-characters");

describe("AuthService", () => {
  test("registers a user and returns a session token", async () => {
    const service = new AuthService(new MemoryUserRepository(), secret);

    const result = await service.register({
      email: "user@example.com",
      name: "Demo User",
      password: "password123"
    });

    expect(result.user.email).toBe("user@example.com");
    expect(result.token.length).toBeGreaterThan(20);
  });

  test("rejects duplicate registrations", async () => {
    const service = new AuthService(new MemoryUserRepository(), secret);
    const input = {
      email: "user@example.com",
      name: "Demo User",
      password: "password123"
    };

    await service.register(input);

    await expect(service.register(input)).rejects.toBeInstanceOf(DuplicateEmailError);
  });

  test("rejects invalid login credentials", async () => {
    const service = new AuthService(new MemoryUserRepository(), secret);

    await expect(service.login({
      email: "missing@example.com",
      password: "password123"
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

