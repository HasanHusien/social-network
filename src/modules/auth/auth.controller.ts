import type { RequestHandler } from "express";
import { catchAsync } from "../../utils/index.js";
import { createSendToken } from "../../utils/sendToken.js";
import { User } from "../index.js";
import { sendWelcomeEmail } from "../../integrations/emails/email.service.js";

export const register: RequestHandler = catchAsync(async (req, res, _next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${req.protocol}://${req.get("host")}/api/users/me`;

  await sendWelcomeEmail(user, url);
  createSendToken(user, 200, res);
});
