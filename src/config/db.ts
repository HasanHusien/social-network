import mongoose from "mongoose";
import { env } from "./env.js";

export const db = {
  url: env.mongoUrl,
  options: {
    dbName: "social-network",
    serverSelectionTimeoutMS: 5000,
  },
};
