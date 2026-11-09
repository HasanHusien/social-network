import express from "express";
const router = express.Router();

import { register } from "../auth/auth.controller.js";
import { getAllUsers } from "./user.controller.js";

router.get("/", getAllUsers);

export default router;
