import type { Server } from "node:http";
import {
  handleUncaughtException,
  handleUnhandledRejection,
} from "./process.loader.js";
import { connectDB } from "./mongoose.loader.js";

export const initLoaders = async (server: Server) => {
  handleUncaughtException();
  await connectDB();
  handleUnhandledRejection(server);
};
