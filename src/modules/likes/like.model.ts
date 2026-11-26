import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "like must have a user"],
    },
    entityType: {
      type: String,
      enum: ["post", "comment"],
      required: [true, "Entity type is required"],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Entity id is required"],
      refPath: "entityType",
    },
  },
  { timestamps: true },
);

likeSchema.index({ user: 1, entityType: 1, entityId: 1 }, { unique: true });
likeSchema.index({ createdAt: -1 });

export const Like = mongoose.model("Like", likeSchema);
