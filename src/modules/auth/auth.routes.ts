import express from "express";
const router = express.Router();

import { forgetPassword, register, resetPassword } from "./auth.controller.js";

router.post("/register", register);
router.post("/forgetPassword", forgetPassword);
router.patch("resetToken/:token", resetPassword);

export default router;
