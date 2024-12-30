import { Document, Types } from 'mongoose';

export interface IReview extends Document {
  _id: string;
  user: Types.ObjectId; // Reference to Users
  product: Types.ObjectId; // Reference to Products
  rating: number; // Rating between 1 and 5
  comment?: string; // Optional comment
  createdAt: Date;
  __v: number;
}
