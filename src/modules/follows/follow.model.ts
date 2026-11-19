import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Follow relationship must have a follower"],
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Follow relationship must have a following user"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "accepted",
    },
  },
  { timestamps: true },
);

export const Follow = mongoose.model("Follow", followSchema);
