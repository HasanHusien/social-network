import { isValidObjectId } from "mongoose";
import { catchAsync, AppError } from "../../utils/index.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { Comment } from "./comment.model.js";
import { Post } from "../posts/post.model.js";

// @route POST /posts/:postId/comments
const createComment = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { content, parentCommentId } = req.body;

  if (typeof postId !== "string" || !isValidObjectId(postId)) {
    return next(new AppError("Invalid post ID", HTTP_STATUS.BAD_REQUEST));
  }

  const post = await Post.findById(postId);
  if (!post || !post.isActive) {
    return next(new AppError("Cannot find post", HTTP_STATUS.NOT_FOUND));
  }

  let parentComment = null;
  if (parentCommentId) {
    parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      return next(
        new AppError("Cannot find this parent comment", HTTP_STATUS.NOT_FOUND),
      );
    }

    if (!parentComment.post.equals(postId)) {
      return next(
        new AppError(
          "Parent comment doesn't belong to this post",
          HTTP_STATUS.BAD_REQUEST,
        ),
      );
    }

    // only ine level for now
    if (parentComment.parentComment) {
      return next(
        new AppError("You cannot reply to a reply", HTTP_STATUS.BAD_REQUEST),
      );
    }
  }

  const comment = await Comment.create({
    author: req.user._id,
    post: postId,
    content,
    parentComment: parentComment ? parentCommentId : null,
  });

  // update counters
  await Post.increaseCommentsCount(postId);
  await Comment.increaseRepliesCount(parentComment);

  await comment.populate("author", "name photo");

  res.status(HTTP_STATUS.CREATED).json({
    status: "success",
    data: { comment },
  });
});

// @route GET /posts/:postId/comments
const getComments = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  const page: any = parseInt(req.query.page as string) || 1;
  const limit: any = parseInt(req.query.limit as string) || 10;

  if (!postId) {
    return next(new AppError("please provide postId", HTTP_STATUS.BAD_REQUEST));
  }

  const post = await Post.findById(postId);
  if (!post) {
    return next(
      new AppError(
        "Cannot find the post or postId is wrong",
        HTTP_STATUS.NOT_FOUND,
      ),
    );
  }

  const filter = {
    post: postId,
    parentComment: null, // one level
    isActive: true,
  };

  const comments = await Comment.find(filter)
    .populate("author", "name photo")
    .populate("post", "content")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // const totalComments = await Comment.countDocuments(filter);

  res.status(HTTP_STATUS.OK).json({
    status: "success",
    result: comments.length,
    data: { comments },
    // pagination: {
    //   page: parseInt(page),
    //   limit: parseInt(limit),
    //   totalComments,
    //   pages: Math.ceil(totalComments / limit),
    // },
  });
});

export { createComment, getComments };
