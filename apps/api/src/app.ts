import { Elysia } from "elysia";
import { loadEnv } from "./config/env";
import { createDatabase } from "./db/database";
import { KyselyUserRepository } from "./features/auth/kysely-user-repository";
import type { AppDependencies } from "./features/auth/routes";
import { authRoutes } from "./features/auth/routes";
import { healthRoutes } from "./features/health/routes";

export function createApp(dependencies: AppDependencies) {
  return new Elysia()
    .use(healthRoutes())
    .use(authRoutes(dependencies));
}

export function createRuntimeApp() {
  const env = loadEnv();
  const db = createDatabase(env.DATABASE_URL);

  return {
    app: createApp({
      userRepository: new KyselyUserRepository(db),
      jwtSecret: new TextEncoder().encode(env.JWT_SECRET),
      secureCookies: env.NODE_ENV === "production"
    }),
    db,
    env
  };
}

