import { Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  privacy: any;
  passwordConfirm: string | undefined;
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
