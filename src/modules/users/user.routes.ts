import express from "express";
const router = express.Router();

import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  resizeUserPhoto,
  updateMe,
  updateUser,
  uploadUserPhoto,
} from "./user.controller.js";
import { protect, restrictTo } from "../../middlewares/protect.js";

router.use(protect);

router.get("/me", getMe, getUser);
router.delete("/deleteMe", deleteMe);
router.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);

router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
