import express from "express";
const router = express.Router();

import {
  deleteUser,
  getAllUsers,
  getUser,
  resizeUserPhoto,
  updateMe,
  updateUser,
  uploadUserPhoto,
} from "./user.controller.js";
import { protect } from "../../middlewares/protect.js";

router.use(protect);

router.get("/", getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
router.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);

export default router;
