import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError, catchAsync } from "../utils/index.js";
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

export { likeOne };
