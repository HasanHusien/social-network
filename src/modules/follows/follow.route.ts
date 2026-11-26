import express from "express";
import {
  followUser,
  getFollowers,
  getFollowing,
  getFollowRequests,
  acceptFollowRequests,
  rejectFollowRequests,
  unFollowUser,
  getFollowStats,
} from "./follow.controller.js";
import { protect } from "../../middlewares/protect.js";
const router = express.Router();

router.use(protect);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);

router.route("/:userId").post(followUser).delete(unFollowUser);
router.put("/:userId/accept", acceptFollowRequests);
router.put("/:userId/reject", rejectFollowRequests);

router.get("/:userId/status", getFollowStats);
router.get("requests", getFollowRequests);

export default router;
