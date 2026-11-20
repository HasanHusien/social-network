import type { Model, Types } from "mongoose";

export interface IPost {
  author: Types.ObjectId | string;
  content: string;
  location: string;
  parentComment: string;
  media: any;
  likes: string;
  visibility: string;
  likesCount: number;
  commentCount: number;
  active: boolean;
}

// static methods && model itself
export interface PostModel extends Model<IPost> {
  increaseCommentsCount(postId: Types.ObjectId | string): Promise<void>;
}
