import type { RequestHandler } from "express";
import { catchAsync } from "../../utils/catchAsync.js";

const createPost: RequestHandler = catchAsync(async (req, res, next) => {});
