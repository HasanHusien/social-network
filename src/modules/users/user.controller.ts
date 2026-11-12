import type { RequestHandler } from "express";
import { User } from "../index.js";
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../../factories/handlerFactory.js";
import { AppError } from "../../utils/appError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import multer from "multer";
import { catchAsync } from "../../utils/catchAsync.js";
import sharp from "sharp";
import { filterObj } from "../../utils/filterObject.js";

const getAllUsers: RequestHandler = getAll(User);
const getUser: RequestHandler = getOne(User);
const updateUser: RequestHandler = updateOne(User);
const deleteUser: RequestHandler = deleteOne(User);

const multerFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Not an image!, Please upload an only images",
        HTTP_STATUS.BAD_REQUEST,
      ),
      false,
    );
  }
};

const uploadUserPhoto = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
}).single("photo");

const resizeUserPhoto: RequestHandler = catchAsync(async (req, _res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.filename)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`/public/img/users/${req.file.filename}`);

  next();
});

const getMe: RequestHandler = (req, _res, next) => {
  req.params.id = req.user.id;
  next();
};

const updateMe: RequestHandler = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError(
        "This route is not for password updates, Please use /updatePassword",
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  const filteredBody: any = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe: RequestHandler = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(HTTP_STATUS.NO_CONTENT).json({
    status: "success",
    data: null,
  });
});

const createUser = (req: any, res: any) => {
  res.status(HTTP_STATUS.SERVER_ERROR).json({
    status: "error",
    message:
      "This route is not defined, Please use authentication/register instead",
  });
};

export {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserPhoto,
  resizeUserPhoto,
  getMe,
  updateMe,
  deleteMe,
  createUser,
};
