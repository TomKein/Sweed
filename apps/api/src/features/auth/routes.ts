import type { ApiErrorResponse } from "@sweed/shared";
import { loginRequestSchema, registerRequestSchema } from "@sweed/shared";
import { Elysia } from "elysia";
import { clearSessionCookie, createSessionCookie, getSessionCookie } from "./cookies";
import { AuthService, DuplicateEmailError, InvalidCredentialsError } from "./service";
import type { UserRepository } from "./user-repository";

export interface AppDependencies {
  userRepository: UserRepository;
  jwtSecret: Uint8Array;
  secureCookies: boolean;
}

export function authRoutes(dependencies: AppDependencies) {
  const auth = new AuthService(dependencies.userRepository, dependencies.jwtSecret);

  return new Elysia({ prefix: "/api/auth" })
    .post("/register", async ({ body, set }) => {
      const parsed = registerRequestSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return validationError(parsed.error.issues[0]?.message);
      }

      try {
        const result = await auth.register(parsed.data);
        set.headers["Set-Cookie"] = createSessionCookie(result.token, dependencies.secureCookies);
        return { user: result.user };
      } catch (error) {
        if (error instanceof DuplicateEmailError) {
          set.status = 409;
          return apiError("EMAIL_TAKEN", error.message);
        }

        throw error;
      }
    })
    .post("/login", async ({ body, set }) => {
      const parsed = loginRequestSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return validationError(parsed.error.issues[0]?.message);
      }

      try {
        const result = await auth.login(parsed.data);
        set.headers["Set-Cookie"] = createSessionCookie(result.token, dependencies.secureCookies);
        return { user: result.user };
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          set.status = 401;
          return apiError("INVALID_CREDENTIALS", error.message);
        }

        throw error;
      }
    })
    .get("/me", async ({ request, set }) => {
      const token = getSessionCookie(request.headers.get("cookie"));
      if (!token) {
        set.status = 401;
        return apiError("UNAUTHENTICATED", "Missing session");
      }

      const user = await auth.getSessionUser(token);
      if (!user) {
        set.status = 401;
        set.headers["Set-Cookie"] = clearSessionCookie();
        return apiError("UNAUTHENTICATED", "Invalid session");
      }

      return { user };
    })
    .post("/logout", ({ set }) => {
      set.headers["Set-Cookie"] = clearSessionCookie();
      return { ok: true };
    });
}

function validationError(message = "Invalid request"): ApiErrorResponse {
  return apiError("VALIDATION_ERROR", message);
}

function apiError(code: string, message: string): ApiErrorResponse {
  return {
    error: {
      code,
      message
    }
  };
}

