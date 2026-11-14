import type { NextFunction, Request, Response } from "express";
import type { HydratedDocument, Model } from "mongoose";
import { HTTP_STATUS } from "../constants/httpStatus.js";

import { catchAsync, AppError, APIFeatures } from "./../utils/index.js";

const deleteOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(HTTP_STATUS.NO_CONTENT).json({
      status: "success",
      data: null,
    });
  });

const updateOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

const createOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc: HydratedDocument<T> = await Model.create(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

const getOne = (Model: any, popOptions?: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

const getAll = (Model: Model<any>, popOptions?: string) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    // To allow for nested GET reviews on tour (hack)

    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();

    if (popOptions) features.query.populate(popOptions);
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        doc,
      },
    });
  });

export { getAll, getOne, deleteOne, updateOne, createOne };
