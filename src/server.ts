import app from "./app.js";
import { env } from "./config/env.js";
import { initLoaders } from "./loaders/index.js";

const start = async () => {
  const server = app.listen(env.port, () => {
    console.log(`🚀 Server running On 127.0.0.1:${env.port}/network`);
  });
  await initLoaders(server);
};

start().catch((err) => console.log(err));
