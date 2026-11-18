import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  likePost,
  updatePost,
} from "./post.controller.js";
import { protect } from "../../middlewares/protect.js";
import { createComment, getComments } from "../comments/comment.controller.js";

router.use(protect);
router.get("/", getAllPosts);
router.post("/new", createPost);
router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);
router.patch("/:id/likes", likePost);

// comment routes
router.route("/:postId/comments").get(getComments).post(createComment);

export default router;
