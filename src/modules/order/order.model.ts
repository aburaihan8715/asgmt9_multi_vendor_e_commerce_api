/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query, Schema, model } from 'mongoose';
import { IOrder, IOrderProduct } from './order.interface';

// Product Sub-document Schema
const orderProductSchema = new Schema<IOrderProduct>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }, // Prevent _id creation for sub-documents
);

const orderSchema = new Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  products: {
    type: [orderProductSchema],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'CANCELED'],
    default: 'PENDING',
  },
  transactionId: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//======== DOCUMENT MIDDLEWARE PRE (save and find)=========

orderSchema.pre(/^find/, function (this: Query<any, IOrder>, next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//========= DOCUMENT MIDDLEWARE POST (save and find)========
// remove password from send data
orderSchema.set('toObject', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

orderSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Order = model<IOrder>('Order', orderSchema);
