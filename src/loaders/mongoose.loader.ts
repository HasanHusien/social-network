import mongoose from "mongoose";
import { db } from "../config/db.js";

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(db.url, db.options);

  console.log("✅ Database connected successfully");
};
