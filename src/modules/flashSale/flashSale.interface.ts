import { Document, Types } from 'mongoose';

export interface IFlashSale extends Document {
  _id: string;
  products: Types.ObjectId[]; // Array of Product references
  discountPercentage: number; // Discount percentage
  startTime: Date; // Start time of the flash sale
  endTime: Date; // End time of the flash sale
  isActive: boolean; // Whether the flash sale is active
  createdAt: Date;
  __v: number;
}
