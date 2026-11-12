import crypto from "crypto";
import type { RequestHandler } from "express";
import { AppError, catchAsync } from "../../utils/index.js";
import { sendToken } from "../../utils/sendToken.js";
import { User } from "../index.js";
import { SendEmail } from "../../integrations/emails/email.service.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";

const register: RequestHandler = catchAsync(async (req, res, _next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const url = `${req.protocol}://${req.get("host")}/api/users/me`;

  await new SendEmail(user, url).sendWelcome();
  sendToken(user, HTTP_STATUS.OK, res);
});

const login: RequestHandler = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError(
        "Please provide email and passowrd",
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(user.password, password))) {
    return next(
      new AppError("Incorrect password or email!", HTTP_STATUS.UNAUTHORIZED),
    );
  }
  sendToken(user, HTTP_STATUS.OK, res);
});

const logout: RequestHandler = (req, res, next) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

const updatePassword: RequestHandler = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(
      new AppError(
        "Something went wrong please try again",
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(
      new AppError("Your current password wrong", HTTP_STATUS.UNAUTHORIZED),
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();
  sendToken(user, HTTP_STATUS.OK, res);
});

const forgetPassword: RequestHandler = catchAsync(async (req, _res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError(
        "There is no user with this email address",
        HTTP_STATUS.NOT_FOUND,
      ),
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const url = `${req.protocol}://${req.get("host")}/api/auth/resetPassword/${resetToken}`;

  try {
    await new SendEmail(user, url).sendPasswordReset();
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save({ validateBeforeSave: false });
    next(
      new AppError(
        "there was error when sending email please try again later",
        HTTP_STATUS.SERVER_ERROR,
      ),
    );
  }
});

const resetPassword: RequestHandler = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (typeof token !== "string") {
    return next(new AppError("Invalid token", HTTP_STATUS.BAD_REQUEST));
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError("Token is invalid or has expired", HTTP_STATUS.BAD_REQUEST),
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  sendToken(user, HTTP_STATUS.OK, res);
});

export {
  register,
  login,
  logout,
  forgetPassword,
  resetPassword,
  updatePassword,
};
