import type { RequestHandler } from "express";
import { catchAsync } from "../../utils/index.js";
import { createSendToken } from "../../utils/sendToken.js";
import { User } from "../index.js";

export const register: RequestHandler = catchAsync(async (req, res, _next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(user, 200, res);
});
