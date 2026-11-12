import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./modules/users/user.routes.js";
import authRouter from "./modules/authentication/auth.routes.js";
import { notFound, errorHandler } from "./middlewares/index.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/authentication", authRouter);
app.use("/api/users", userRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
