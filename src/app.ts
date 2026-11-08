import express from "express";
import userRouter from "./routes/user.routes.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middlewares/index.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/users", userRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
