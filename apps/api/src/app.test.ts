import { describe, expect, test } from "bun:test";
import { createApp } from "./app";
import { MemoryUserRepository } from "./test/memory-user-repository";

const secret = new TextEncoder().encode("test-secret-with-at-least-32-characters");

describe("API app", () => {
  test("registers, authenticates, and reads current user", async () => {
    const app = createApp({
      userRepository: new MemoryUserRepository(),
      jwtSecret: secret,
      secureCookies: false
    });

    const registerResponse = await app.handle(jsonRequest("/api/auth/register", {
      email: "user@example.com",
      name: "Demo User",
      password: "password123"
    }));

    expect(registerResponse.status).toBe(200);

    const cookie = registerResponse.headers.get("set-cookie");
    expect(cookie).toContain("sweed_session=");

    const meResponse = await app.handle(new Request("http://localhost/api/auth/me", {
      headers: {
        cookie: cookie ?? ""
      }
    }));

    expect(meResponse.status).toBe(200);
    const body = await meResponse.json();
    expect(body.user.email).toBe("user@example.com");
  });

  test("rejects current user requests without a session", async () => {
    const app = createApp({
      userRepository: new MemoryUserRepository(),
      jwtSecret: secret,
      secureCookies: false
    });

    const response = await app.handle(new Request("http://localhost/api/auth/me"));

    expect(response.status).toBe(401);
  });
});

function jsonRequest(path: string, body: unknown): Request {
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

