import express from "express";
import { createPost, getAllPosts, getPost } from "./post.controller.js";
import { protect } from "../../middlewares/protect.js";
const router = express.Router();

router.use(protect);
router.get("/", getAllPosts);
router.route("/:id").get(getPost);
router.post("/new", createPost);

export default router;
