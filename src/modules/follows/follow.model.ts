import mongoose from "mongoose";
import { AppError } from "../../utils/appError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";

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

followSchema.pre("validate", function (next: any) {
  if (this.follower && this.following && this.follower.equals(this.following)) {
    return next(
      new AppError("Users Cannot follow themselves", HTTP_STATUS.BAD_REQUEST),
    );
  }
  next();
});

followSchema.statics.getFollowers = function (userId, status = "accepted") {
  return this.find({ following: userId, status }).populate(
    "follower",
    "name photo",
  );
};

followSchema.statics.getFollowing = function (userId, status = "accepted") {
  return this.find({ followers: userId, status }).populate(
    "follower",
    "name photo",
  );
};

followSchema.statics.getFollowStatus = function (followerId, followingId) {
  return this.findOne({
    follower: followerId,
    following: followingId,
    status: "accepted",
  });
};

followSchema.statics.getFollowStats = async function (userId) {
  const [followersCount, followingCount] = await Promise.all([
    this.countDocuments({ followers: userId, status: "accepted" }),
    this.countDocuments({ following: userId, status: "accepted" }),
  ]);

  return { followersCount, followingCount };
};
export const Follow = mongoose.model("Follow", followSchema);
