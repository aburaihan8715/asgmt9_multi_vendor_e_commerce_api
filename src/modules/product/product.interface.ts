import { Document, Types } from 'mongoose';
import { ICategory } from '../category/category.interface';
import { IShop } from '../shop/shop.interface';
import { IUser } from '../user/user.interface';

export interface IProduct extends Document {
  _id: string;
  name: string;
  price: number;
  category: Types.ObjectId | ICategory;
  inventoryCount: number;
  description: string;
  images?: string[];
  discount?: number;
  shop: Types.ObjectId | IShop;
  vendor: Types.ObjectId | IUser;
  isDeleted?: boolean;
  createdAt: Date;
  __v: number;
}
