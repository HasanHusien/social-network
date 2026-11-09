import type { SignOptions } from "jsonwebtoken";

// Read a required variable, and stop the app early if it is missing
const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);

  return value;
};

type ExpiresIn = NonNullable<SignOptions["expiresIn"]>;

export const env = {
  nodeEnv: process.env.NODE_ENV || "production",
  port: Number(process.env.PORT) || 8000,
  mongoUrl: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: required("JWT_EXPIRES_IN") as ExpiresIn,
  cookieExpiresIn: required("JWT_COOKIE_EXPIRES_IN"),
  sendgridKey: required("SENDGRID_API_KEY"),
  sendgridEmail:required("SENDGRID_EMAIL")
};
