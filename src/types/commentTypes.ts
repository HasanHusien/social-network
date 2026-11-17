import type { Model, Types } from "mongoose";

export interface IComment {
  author: Types.ObjectId | string;
  post: Types.ObjectId | any;
  content: string;
  location: string;
  parentComment: Types.ObjectId | string | null;
  media: any;
  likes: any;
  visibility: string;
  likesCount: number;
  repliesCount: number;
  isActive: boolean;
}

export interface ICommentMethods {
  isLikedBy(userId: Types.ObjectId | string): Boolean;
  isReply(): boolean;
}

// static methods && model itself
export interface CommentModel extends Model<IComment> {
  increaseRepliesCount(parentComment: any): any;
}
