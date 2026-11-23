import { Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  photo: string;
  coverPhoto: string;
  role: string;
  privacy: any;
  bio: string;
  website: string;
  dateOfBirth: Date;
  gender: string;
  follower: string[] | string;
  following: string[] | string;
  followersCount: number;
  followingCount: number;
  passwordChangedAt: any;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined | number;
  active: boolean;
}

// model && statics
export interface IUserModel extends Model<IUser> {
  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
  changePasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}
