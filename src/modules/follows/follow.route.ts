import express from "express";
import { followUser, unFollowUser } from "./follow.controller.js";
import { protect } from "../../middlewares/protect.js";
const router = express.Router();

router.use(protect);
router.route("/:userId").post(followUser).delete(unFollowUser);

export default router;
