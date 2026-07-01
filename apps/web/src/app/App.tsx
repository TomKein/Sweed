import { Alert, AppShell, Button, Container, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { AuthPanel } from "../features/auth/AuthPanel";
import { useCurrentUser, useLogout } from "../features/auth/api";

export function App() {
  const currentUser = useCurrentUser();
  const logout = useLogout();

  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Title order={3}>Sweed</Title>
            {currentUser.data ? (
              <Button variant="light" onClick={() => logout.mutate()} loading={logout.isPending}>
                Sign out
              </Button>
            ) : null}
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="sm">
          {currentUser.isLoading ? (
            <Group justify="center" mt="xl">
              <Loader />
            </Group>
          ) : null}

          {currentUser.isError ? (
            <Alert color="red" title="Unable to load session">
              The API is not reachable or returned an unexpected response.
            </Alert>
          ) : null}

          {!currentUser.isLoading && !currentUser.data ? <AuthPanel /> : null}

          {currentUser.data ? (
            <Stack gap="sm" mt="xl">
              <Title order={2}>Welcome, {currentUser.data.name}</Title>
              <Text c="dimmed">
                You are signed in as {currentUser.data.email}. This screen is backed by the
                authenticated `/api/auth/me` query.
              </Text>
            </Stack>
          ) : null}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

