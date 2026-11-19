import mongoose from "mongoose";
import type { Types } from "mongoose";

import type {
  CommentModel,
  IComment,
  ICommentMethods,
} from "../../types/commentTypes.js";

const commentSchema = new mongoose.Schema<
  IComment,
  CommentModel,
  ICommentMethods
>(
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true },
);

commentSchema.index({ post: -1, parentComment: -1, createdAt: -1 });

commentSchema.statics.increaseRepliesCount = async function (parentComment) {
  if (parentComment) {
    await this.findByIdAndUpdate(parentComment._id, {
      $inc: { repliesCount: 1 },
    });
  }
};

// can put multiple methods once
commentSchema.method({
  isReply(this: any): boolean {
    return this.parentComment !== null;
  },
});

export const Comment = mongoose.model<IComment, CommentModel>(
  "Comment",
  commentSchema,
);
