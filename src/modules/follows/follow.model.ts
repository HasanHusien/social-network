import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    followers: {
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

followSchema.statics.getFollowers = function (userId, status = "accepted") {
  return this.find({ following: userId, status }).populate(
    "follower",
    "name photos",
  );
};

followSchema.statics.getFollowing = function (userId, status = "accepted") {
  return this.find({ followers: userId, status }).populate(
    "follower",
    "name photos",
  );
};
export const Follow = mongoose.model("Follow", followSchema);
