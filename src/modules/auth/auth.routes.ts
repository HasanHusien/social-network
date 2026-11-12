import express from "express";
const router = express.Router();

import {
  forgetPassword,
  register,
  resetPassword,
  updatePassword,
} from "./auth.controller.js";

router.post("/register", register);
router.post("/forgetPassword", forgetPassword);
router.patch("resetToken/:token", resetPassword);
router.patch("/updatePassword", updatePassword);

export default router;
