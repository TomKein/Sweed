import { createRuntimeApp } from "./app";

const { app, env } = createRuntimeApp();

app.listen(env.PORT);

console.log(`Sweed API listening on http://localhost:${env.PORT}`);

