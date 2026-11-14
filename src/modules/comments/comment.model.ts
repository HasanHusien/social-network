import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "comment muse have an author"],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "comment should have a post"],
    },
    content: {
      type: String,
      required: [true, "please add comment text"],
      maxlength: [1000, "max size for content 1000 letters"],
      trim: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    repliesCount: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        _id: false,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true },
);

commentSchema.index({ post: -1, parentComment: -1, createdAt: -1 });

export const Comment = mongoose.model("Comment", commentSchema);
