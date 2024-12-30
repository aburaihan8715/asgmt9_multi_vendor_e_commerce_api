import { Document, Types } from 'mongoose';
import { IProduct } from '../product/product.interface';

export interface ICartItem {
  product: Types.ObjectId | IProduct;
  quantity: number;
}
export interface ICart extends Document {
  _id: string;
  user: Types.ObjectId | string;
  shop: Types.ObjectId | string;
  items: ICartItem[];
  totalItems?: number;
  totalAmount?: number;
  createdAt: Date;
  __v: number;
}
