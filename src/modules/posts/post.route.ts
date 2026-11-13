import express from "express";
import { createPost } from "./post.controller.js";
import { protect } from "../../middlewares/protect.js";
const router = express.Router();

router.use(protect);

router.post("/new", createPost);

export default router;
