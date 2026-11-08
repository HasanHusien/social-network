import type { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const signToken = (id: string): string => {
  return jwt.sign({ id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

const createSendToken = (
  user: any,
  statusCode: number,
  res: Response,
): void => {
  const convertToDays = 24 * 60 * 60 * 1000;
  const token = signToken(user._id);

  const cookieExpiresIn = new Date(
    Date.now() + Number(env.cookieExpiresIn ?? 7) * convertToDays,
  );

  res.cookie("jwt", token, {
    expires: cookieExpiresIn,
    httpOnly: true,
    secure: env.nodeEnv === "production",
  });
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
  });
};

export { createSendToken };
