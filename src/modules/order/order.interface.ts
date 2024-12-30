import { Document, Types } from 'mongoose';

// Interface for the Product Sub-document
export interface IOrderProduct {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  _id: string;
  user: Types.ObjectId;
  email: string;
  shop: Types.ObjectId;
  products: IOrderProduct[];
  totalAmount: number;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELED';
  transactionId: string;
  createdAt: Date;
  __v: number;
}
