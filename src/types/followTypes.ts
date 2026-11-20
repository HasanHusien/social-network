import type { Model, Types, HydratedDocument } from "mongoose";

type FollowStatus = "pending" | "accepted" | "blocked";

interface IFollow {
  follower: Types.ObjectId;
  following: Types.ObjectId;
  status: FollowStatus;
}

interface FollowModel extends Model<IFollow> {
  getFollowers(
    userId: string | Types.ObjectId,
    status?: FollowStatus,
    page?: number,
    limit?: number,
  ): Promise<HydratedDocument<IFollow>[]>;
  getFollowing(
    userId: string | Types.ObjectId,
    status?: FollowStatus,
    page?: number,
    limit?: number,
  ): Promise<HydratedDocument<IFollow>[]>;
  getFollowStatus(
    followerId: string | Types.ObjectId,
    followingId: string | Types.ObjectId,
  ): Promise<HydratedDocument<IFollow> | null>;
  getFollowStats(
    userId: string | Types.ObjectId,
  ): Promise<{ followersCount: number; followingCount: number }>;
}
