import type {  Types } from "mongoose";

type FollowStatus = "pending" | "accepted" | "blocked";

interface IFollow {
  follower: Types.ObjectId;
  following: Types.ObjectId;
  status: FollowStatus;
}

