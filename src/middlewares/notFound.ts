import type { NextFunction, Response, Request } from "express";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "../utils/index.js";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server`,
      HTTP_STATUS.NOT_FOUND,
    ),
  );
};

export { notFound };
