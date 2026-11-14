import type { RequestHandler } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { Post } from "./post.model.js";
import { getAll, getOne } from "../../factories/handlerFactory.js";

const getAllPosts = getAll(Post);
const getPost = getOne(Post, "author");

const createPost: RequestHandler = catchAsync(async (req, res, next) => {
  const { content, media, location } = req.body;

  if (!content || !media) {
    return next(
      new AppError(
        "Post should have content and media",
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  const post = await Post.create({
    author: req.user.id,
    content,
    media,
    location,
  });

  res.status(HTTP_STATUS.CREATED).json({
    status: "success",
    post,
  });
});

export { createPost, getPost, getAllPosts };
