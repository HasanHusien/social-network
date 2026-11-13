import { Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  privacy: any;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date | number;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined | number;
  active: boolean;
}

export interface IUserMethods {
  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}
export type UserModel = Model<IUser, {}, IUserMethods>;
