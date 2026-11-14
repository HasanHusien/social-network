import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "./post.controller.js";
import { protect } from "../../middlewares/protect.js";
const router = express.Router();

router.use(protect);
router.get("/", getAllPosts);
router.post("/new", createPost);
router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);

export default router;
