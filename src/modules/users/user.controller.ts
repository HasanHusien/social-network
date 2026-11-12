import type { RequestHandler } from "express";
import { User } from "../index.js";
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../../factories/handlerFactory.js";

const getAllUsers: RequestHandler = getAll(User);
const getUser: RequestHandler = getOne(User);
const updateUser: RequestHandler = updateOne(User);
const deleteUser: RequestHandler = deleteOne(User);

export { getAllUsers, getUser, updateUser, deleteUser };
