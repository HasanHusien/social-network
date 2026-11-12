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

export { getAllUsers, getUser, updateUser, deleteUser, uploadUserPhoto };
