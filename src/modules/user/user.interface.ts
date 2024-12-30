import { Document, Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

// NOTE: TUser should IUser
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt?: Date;
  role: 'superAdmin' | 'admin' | 'customer' | 'vendor';
  address?: string;
  phone?: string;
  isDeleted: boolean;
  createdAt: Date;
  __v: number;
}

export interface IUserModel extends Model<IUser> {
  getUserById(id: string): Promise<IUser>;

  getUserByEmail(email: string): Promise<IUser>;

  isPasswordCorrect(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isPasswordChangedAfterJwtIssued(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
