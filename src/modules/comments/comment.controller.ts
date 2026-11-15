import type { RequestHandler } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { Comment } from "./comment.model.js";
import { Post } from "../posts/post.model.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";

const createComment = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { content, parentCommentId } = req.body;
  const post = await Post.findById(postId);
  const parentComment = await Comment.findById(parentCommentId);

  if (!post || !post.isActive) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      status: "fail",
      message: "Cannot find this post",
    });
  }

  if (!parentComment || !parentComment.isActive) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      status: "fail",
      message: "Cannot find this parent comment",
    });
  }
});
