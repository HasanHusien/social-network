import express from "express";
import {
  deleteComment,
  likeComment,
  updateComment,
} from "./comment.controller.js";
import { protect } from "../../middlewares/protect.js";
const router = express.Router();

router.use(protect);
router.route("/:id").patch(updateComment).delete(deleteComment);
router.patch("/:commentId/likes", likeComment);

export default router;

// POST /network/post/:postId/comments	postRouter
// GET /network/post/:postId/comments	postRouter
// GET /network/comments/:commentId/replies	commentRouter
// PATCH /network/comments/:commentId	commentRouter
// DELETE /network/comments/:commentId	commentRouter
// POST /network/comments/:commentId/like	commentRouter
