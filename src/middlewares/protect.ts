import type { Request, RequestHandler } from "express";
import { catchAsync, AppError } from "../utils/index.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { User } from "../modules/index.js";

interface TokenPayload extends JwtPayload {
  id: string;
}

// Get the token from the Authorization header or the cookie
const extractToken = (req: Request): string | undefined => {
  const auth = req.headers.authorization;

  if (auth?.startsWith("Bearer ")) return auth.split(" ")[1];
  return req.cookies?.jwt;
};

const protect: RequestHandler = catchAsync(async (req, res, next) => {
  let token = extractToken(req);

  if (!token) {
    return next(
      new AppError(
        "You are not logged in. Please log in.",
        HTTP_STATUS.UNAUTHORIZED,
      ),
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token no longer exists.",
        HTTP_STATUS.UNAUTHORIZED,
      ),
    );
  }

  // decoded.iat is token creating time && jwt.sign adds iat automatically
  if (decoded.iat && user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Password was changed recently. Please log in again.",
        HTTP_STATUS.UNAUTHORIZED,
      ),
    );
  }
  req.user = user;

  next();
});

const restrictTo = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return new AppError(
        "You do not have a permission to perform this action",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    next();
  };
};

export { protect, restrictTo };
