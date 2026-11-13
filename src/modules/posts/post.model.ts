import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
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
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
  },
  { timestamps: true },
);

// Indexes for better performance
// postSchema.index({ author: 1, createdAt: -1 });
// postSchema.index({ createdAt: -1 });
// postSchema.index({ likesCount: -1 });
// postSchema.index({ commentsCount: -1 });
// postSchema.index({ visibility: 1 });

const Post = mongoose.model("Post", postSchema);

export { Post };
