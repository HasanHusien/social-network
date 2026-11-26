import { HTTP_STATUS } from "../constants/httpStatus.js";
import { Follow } from "../modules/follows/follow.model.js";
import { User } from "../modules/index.js";
import { APIFeatures, AppError, catchAsync } from "../utils/index.js";
import type { NextFunction, Request, Response } from "express";

const likeOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(
        new AppError("Document not found, Or wrong id", HTTP_STATUS.NOT_FOUND),
      );
    }

    // isLikedBy(this: any, userId: Types.ObjectId | string): boolean {
    //   return this.likes.some(
    //     (like: any) => like.user.toString() === userId.toString(),
    //   );
    // },

    const userId = req.user._id.toString();
    const isLiked = doc.likes.some(
      (like: any) => like.user.toString() === userId,
    );

    if (isLiked) {
      doc.likes = doc.likes.filter(
        (like: any) => like.user.toString() !== userId,
      );
    } else {
      // liked
      doc.likes.push({ user: userId });
    }

    doc.likesCount = doc.likes.length;
    await doc.save();

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      message: isLiked ? "unliked" : "liked",
      data: {
        likesCount: doc.likesCount,
        isLiked: !isLiked,
      },
    });
  });

// @route  GET /api/follow/:userId/followers | following   
const getFollowList = (type: any) =>
  catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    if (!userId) {
      return next(new AppError("Invalid userId", HTTP_STATUS.BAD_REQUEST));
    }

    if (type !== "followers" && type !== "following")
      return next(new AppError("Invalid type", HTTP_STATUS.BAD_REQUEST));

    const matchField = type === "followers" ? "following" : "follower";
    const populateField = type === "followers" ? "follower" : "following";

    const user = await User.findById(userId);
    if (!user)
      return next(new AppError("Cannot find the user", HTTP_STATUS.NOT_FOUND));

    const isOwner = req.user._id.equals(userId);

    if (user.privacy.isPrivateAccount && !isOwner) {
      const isFollowing = await Follow.exists({
        follower: req.user._id,
        following: userId,
        status: "accepted",
      });

      if (!isFollowing)
        return next(new AppError("Account is private", HTTP_STATUS.FORBIDDEN));
    }

    const features = new APIFeatures(
      Follow.find({ [matchField]: userId, status: "accepted" }),
      req.query,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const list = await features.query.populate(populateField, "name photo");

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data: { [type]: list },
    });
  });

export { likeOne, getFollowList };
