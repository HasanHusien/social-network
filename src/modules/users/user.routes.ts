import express from "express";
const router = express.Router();

import { updatePassword } from "../auth/auth.controller.js";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "./user.controller.js";
import { protect } from "../../middlewares/protect.js";

router.use(protect);

router.get("/", getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

router.patch("/updatePassword", updatePassword);

export default router;
