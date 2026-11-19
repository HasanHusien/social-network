import type { IPost, PostModel } from "./../../types/postTypes.js";
import mongoose from "mongoose";

const postSchema = new mongoose.Schema<IPost, PostModel>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post must have an author"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      maxlength: [2000, "Post content cannot exceed 2000 characters"],
      trim: true,
    },
    media: {
      type: [
        {
          _id: false,
          type: { type: String, enum: ["image", "video"], required: true },
          url: { type: String, required: true },
        },
      ],
      default: [],
      validate: {
        validator: (arr: unknown[]) => arr.length <= 10,
        message: "Max media size is 10 items",
      },
    },
    location: {
      type: String,
      trim: true,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "followers"],
      default: "public",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Indexes for better performance
// postSchema.index({ author: 1, createdAt: -1 });
// postSchema.index({ createdAt: -1 });
// postSchema.index({ likesCount: -1 });
// postSchema.index({ commentsCount: -1 });
// postSchema.index({ visibility: 1 });

postSchema.statics.increaseCommentsCount = async function (postId) {
  await this.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
};

const Post = mongoose.model<IPost, PostModel>("Post", postSchema);

export { Post };
