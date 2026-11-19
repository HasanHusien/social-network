import type { RequestHandler } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { Post } from "./post.model.js";
import { deleteOne, getAll, getOne, updateOne } from "../../factories/crud.js";
import { likeOne } from "../../factories/resource.js";

const createPost = catchAsync(async (req, res, next) => {
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

const getAllPosts = getAll(Post);
const getPost = getOne(Post, "author");
const updatePost = updateOne(Post);
const deletePost = deleteOne(Post);
const likePost = likeOne(Post);

export { createPost, getPost, getAllPosts, updatePost, deletePost, likePost };
