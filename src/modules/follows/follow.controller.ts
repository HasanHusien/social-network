import { Types } from "mongoose";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { AppError, catchAsync } from "../../utils/index.js";
import { User } from "../users/user.model.js";
import { Follow } from "./follow.model.js";
import { parseObjectId } from "../../utils/parseObjectId.js";

const followUser = catchAsync(async (req, res, next) => {
  const sourceUserId = req.user._id;
  const targetUserId = req.params.userId;

  // if (targetUserId) {
  //   return next(new AppError("Cannot find userId", HTTP_STATUS.BAD_REQUEST));
  // }

  if (sourceUserId === targetUserId) {
    return next(
      new AppError("Users Cannot follow themselves", HTTP_STATUS.BAD_REQUEST),
    );
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser || !targetUser.active) {
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
    // status: targetUser.isPrivate ? "pending" : "accepted",
  });
});
