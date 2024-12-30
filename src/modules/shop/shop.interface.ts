import { Document, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export interface IShop extends Document {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  vendor: Types.ObjectId | IUser;
  followers: Types.ObjectId[] | IUser[];
  followersCount: number;
  isDeleted: boolean;
  createdAt: Date;
  __v: number;
}
