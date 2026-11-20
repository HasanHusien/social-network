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
  active: boolean;
}

export interface ICommentMethods {
  isReply(): boolean;
}

// static methods && model itself
export interface CommentModel extends Model<IComment, {}, ICommentMethods> {
  increaseRepliesCount(parentComment: any): any;
}
