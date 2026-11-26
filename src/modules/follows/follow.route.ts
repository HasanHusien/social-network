import express from "express";
import {
  acceptFollowRequest,
  followUser,
  getFollowers,
  getFollowing,
  rejectFollowRequest,
  unFollowUser,
} from "./follow.controller.js";
import { protect } from "../../middlewares/protect.js";
const router = express.Router();

router.use(protect);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);

router.route("/:userId").post(followUser).delete(unFollowUser);
router.put("/:userId/accept", acceptFollowRequest);
router.put("/:userId/reject", rejectFollowRequest);

export default router;
