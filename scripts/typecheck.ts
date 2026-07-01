const checks = [
  { name: "shared", cwd: "packages/shared" },
  { name: "api", cwd: "apps/api" },
  { name: "web", cwd: "apps/web" }
];

for (const check of checks) {
  console.log(`\n> typecheck ${check.name}`);

  const result = Bun.spawnSync({
    cmd: [process.execPath, "run", "typecheck"],
    cwd: check.cwd,
    stdout: "inherit",
    stderr: "inherit"
  });

  if (result.exitCode !== 0) {
    process.exit(result.exitCode ?? 1);
  }
}
