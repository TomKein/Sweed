import { Elysia } from "elysia";

export function healthRoutes() {
  return new Elysia({ prefix: "/api" }).get("/health", () => ({
    ok: true,
    service: "sweed-api"
  }));
}

