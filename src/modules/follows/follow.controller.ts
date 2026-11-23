import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { AppError, catchAsync } from "../../utils/index.js";
import { User } from "../users/user.model.js";
import { Follow } from "./follow.model.js";
import { parseObjectId } from "../../utils/parseObjectId.js";

// @route   POST /network/follow/:userId
const followUser = catchAsync(async (req, res, next) => {
  const sourceUserId = req.user._id;
  const targetUserId = parseObjectId(req.params.userId);

  if (!targetUserId) {
    return next(new AppError("Invalid userId", HTTP_STATUS.BAD_REQUEST));
  }

  if (sourceUserId.equals(targetUserId)) {
    return next(
      new AppError("Users Cannot follow themselves", HTTP_STATUS.BAD_REQUEST),
    );
  }

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    return next(
      new AppError(
        `Cannot find User with this ${targetUserId} Id`,
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  // to prevent following twice
  const hasFollowed = await Follow.findOne({
    follower: sourceUserId,
    following: targetUserId!,
  });

  if (hasFollowed) {
    return next(
      new AppError("Already following this user", HTTP_STATUS.BAD_REQUEST),
    );
  }

  const follow = await Follow.create({
    follower: sourceUserId,
    following: targetUserId,
    status: targetUser.privacy.isPrivateAccount ? "pending" : "accepted",
  });

  await User.findByIdAndUpdate(sourceUserId, {
    $inc: { followingCount: 1 },
  });
  await User.findByIdAndUpdate(targetUserId, {
    $inc: { followersCount: 1 },
  });

  // PUSH FOLLOWER && FOLLOWING OBJECTID HIRE.

  res.status(HTTP_STATUS.OK).json({
    status: "success",
    message: targetUser.privacy.isPrivateAccount
      ? "Follow request sent"
      : "User followed successfully",

    date: {
      follow: {
        status: follow.status,
        following: {
          _id: targetUser._id,
          name: targetUser.name,
          photo: targetUser.photo,
        },
      },
    },
  });
});

// @route   DELETE /network/follow/:userId
const unFollowUser = catchAsync(async (req, res, next) => {
  const sourceUserId = req.user._id;
  const targetUserId = parseObjectId(req.params.userId);

  if (!targetUserId) {
    return next(new AppError("Invalid userId", HTTP_STATUS.BAD_REQUEST));
  }

  const follow = await Follow.findByIdAndDelete({
    follower: sourceUserId,
    following: targetUserId,
  });

  if (!follow) {
    return next(
      new AppError(
        "You aren't following this account",
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  await User.findByIdAndUpdate(sourceUserId, { $inc: { followingCount: -1 } });
  await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: -1 } });

  res.status(HTTP_STATUS.ACCEPTED).json({
    status: "success",
    message: "Account unfollowed successfully",
  });
});

// @route put /network/follow/:userId/accept
const acceptFollowRequest = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  if (!userId)
    return next(new AppError("Invalid userId", HTTP_STATUS.BAD_REQUEST));

  const follow = await Follow.findOne({
    follower: userId,
    following: req.user._id,
    status: "pending",
  });

  if (!follow)
    return next(
      new AppError("Cannot found follow request", HTTP_STATUS.BAD_REQUEST),
    );

  follow.status = "accepted";
  await follow.save();

  res.status(HTTP_STATUS.ACCEPTED).json({
    status: "success",
    message: "Follow request accepted",
  });
});

export { followUser, unFollowUser, acceptFollowRequest };
