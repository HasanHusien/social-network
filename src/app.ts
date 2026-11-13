import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./modules/users/user.routes.js";
import postRouter from "./modules/posts/post.route.js";

import authRouter from "./modules/authentication/auth.routes.js";
import { notFound, errorHandler } from "./middlewares/index.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/network/authentication", authRouter);
app.use("/network/users", userRouter);
app.use("/network/post", postRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
