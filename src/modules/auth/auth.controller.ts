import type { RequestHandler } from "express";
import { AppError, catchAsync } from "../../utils/index.js";
import { sendToken } from "../../utils/sendToken.js";
import { User } from "../index.js";
import { SendEmail } from "../../integrations/emails/email.service.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";

export const register: RequestHandler = catchAsync(async (req, res, _next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const url = `${req.protocol}://${req.get("host")}/api/users/me`;

  await new SendEmail(user, url).sendWelcome();
  sendToken(user, 200, res);
});

export const login: RequestHandler = catchAsync(async (req, res, next) => {
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
  sendToken(user, 200, res);
});

export const logout: RequestHandler = (req, res, next) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

export const forgetPassword: RequestHandler = catchAsync(
  async (req, res, next) => {
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
          500,
        ),
      );
    }
  },
);
