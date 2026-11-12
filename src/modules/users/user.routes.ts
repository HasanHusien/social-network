import express from "express";
const router = express.Router();

import { updatePassword } from "../auth/auth.controller.js";
import { getAllUsers } from "./user.controller.js";
import { protect } from "../../middlewares/protect.js";

router.get("/", getAllUsers);

router.use(protect);

router.patch("/updatePassword", updatePassword);

export default router;
