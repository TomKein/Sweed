import { Alert, Button, Paper, PasswordInput, SegmentedControl, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { ApiError } from "../../api/http";
import { useLogin, useRegister } from "./api";

type AuthMode = "login" | "register";

interface AuthFormValues {
  email: string;
  name: string;
  password: string;
}

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>("login");
  const login = useLogin();
  const register = useRegister();
  const activeMutation = mode === "login" ? login : register;

  const form = useForm<AuthFormValues>({
    initialValues: {
      email: "",
      name: "",
      password: ""
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Enter a valid email"),
      name: (value) => (mode === "register" && value.trim().length === 0 ? "Name is required" : null),
      password: (value) => (value.length >= 8 ? null : "Use at least 8 characters")
    }
  });

  const error = activeMutation.error;
  const errorMessage = error instanceof ApiError ? error.message : error?.message;

  return (
    <Paper withBorder p="lg" radius="sm" mt="xl">
      <form
        onSubmit={form.onSubmit((values) => {
          if (mode === "login") {
            login.mutate({ email: values.email, password: values.password });
            return;
          }

          register.mutate(values);
        })}
      >
        <Stack>
          <Title order={2}>{mode === "login" ? "Sign in" : "Create account"}</Title>

          <SegmentedControl
            value={mode}
            onChange={(value) => {
              setMode(value as AuthMode);
              login.reset();
              register.reset();
            }}
            data={[
              { label: "Sign in", value: "login" },
              { label: "Register", value: "register" }
            ]}
          />

          {errorMessage ? (
            <Alert color="red" title="Authentication failed">
              {errorMessage}
            </Alert>
          ) : null}

          <TextInput
            label="Email"
            autoComplete="email"
            {...form.getInputProps("email")}
          />

          {mode === "register" ? (
            <TextInput
              label="Name"
              autoComplete="name"
              {...form.getInputProps("name")}
            />
          ) : null}

          <PasswordInput
            label="Password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            {...form.getInputProps("password")}
          />

          <Button type="submit" loading={activeMutation.isPending}>
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

