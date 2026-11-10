import { HTTP_STATUS } from "../constants/httpStatus.js";
import {AppError} from "../utils/index.js";
import type { NextFunction, Request, Response } from "express";

const handleCastErrorDB = (err: AppError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, HTTP_STATUS.BAD_REQUEST);
};

const handleDuplicateFieldsDB = (err: AppError): AppError => {
  const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
  const value = String(Object.values(err.keyValue ?? {})[0] ?? "");
  return new AppError(
    `Duplicate ${field}: "${value}". Please use another value.`,
    400,
  );
};

const handleValidationErrorDB = (err: AppError): AppError => {
  const messages = Object.values(err.errors ?? {}).map((el) => el.message);
  return new AppError(
    `Invalid input data. ${messages.join(". ")}`,
    HTTP_STATUS.BAD_REQUEST,
  );
};

const handleJWTError = () => {
  return new AppError(
    "Invalid token please try again",
    HTTP_STATUS.UNAUTHORIZED,
  );
};

const handleExpiredError = () => {
  return new AppError(
    "Token has been expired, please login again",
    HTTP_STATUS.UNAUTHORIZED,
  );
};

const sendErrorDevelopment = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("UNEXPECTED ERROR:", err);

    res.status(HTTP_STATUS.SERVER_ERROR).json({
      status: "error",
      message:
        "Something went wrong. If the problem continues, please contact support.",
    });
  }
};

function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  err.statusCode = err.statusCode || HTTP_STATUS.SERVER_ERROR;
  err.status = err.status || "error";

  let error: AppError = err;

  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleExpiredError();
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);

  if (process.env.NODE_ENV === "development") {
    sendErrorDevelopment(error, res);
  } else {
    sendErrorProduction(error, res);
  }
}

export { errorHandler };
