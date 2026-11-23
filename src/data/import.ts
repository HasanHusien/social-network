import { User } from "../modules/index.js";
import { env } from "../config/env.js";
import { connectDB } from "../loaders/mongoose.loader.js";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

await connectDB();
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, "user.json"), "utf-8"),
);
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
