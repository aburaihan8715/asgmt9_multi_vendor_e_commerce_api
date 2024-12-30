/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query, Schema, model } from 'mongoose';
import { IFlashSale } from './flashSale.interface';

const flashSaleSchema = new Schema<IFlashSale>({
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  ],
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//======== DOCUMENT MIDDLEWARE PRE (save and find)=========

flashSaleSchema.pre(
  /^find/,
  function (this: Query<any, IFlashSale>, next) {
    this.find({ isDeleted: { $ne: true } });
    next();
  },
);

//========= DOCUMENT MIDDLEWARE POST (save and find)========
// remove password from send data
flashSaleSchema.set('toObject', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

flashSaleSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const FlashSale = model<IFlashSale>('FlashSale', flashSaleSchema);
