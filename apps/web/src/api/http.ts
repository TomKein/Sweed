import type { ApiErrorResponse } from "@sweed/shared";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly payload: ApiErrorResponse
  ) {
    super(payload.error.message);
  }
}

export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...init.headers
    }
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.json());
  }

  return response.json() as Promise<T>;
}

