import { Document } from 'mongoose';

export interface ICoupon extends Document {
  _id: string;
  code: string; // Unique coupon code
  discountPercentage: number; // Discount percentage
  validFrom: Date; // Start date for coupon validity
  validTo: Date; // End date for coupon validity
  isActive: boolean; // Coupon activation status
  createdAt: Date;
  __v: number;
}
