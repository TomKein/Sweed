import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from "@sweed/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiJson } from "../../api/http";

export const authKeys = {
  me: () => ["auth", "me"] as const
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getCurrentUser,
    retry: false
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (result) => {
      queryClient.setQueryData(authKeys.me(), result.user);
    }
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      queryClient.setQueryData(authKeys.me(), result.user);
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me(), null);
    }
  });
}

async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch("/api/auth/me", {
    credentials: "include"
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load current user");
  }

  const result = await response.json() as AuthResponse;
  return result.user;
}

async function register(input: RegisterRequest): Promise<AuthResponse> {
  return apiJson<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

async function login(input: LoginRequest): Promise<AuthResponse> {
  return apiJson<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

async function logout(): Promise<void> {
  await apiJson<{ ok: true }>("/api/auth/logout", {
    method: "POST"
  });
}

