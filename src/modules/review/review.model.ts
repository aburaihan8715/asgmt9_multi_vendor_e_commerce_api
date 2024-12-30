/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query, Schema, model } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//======== INDEXING =========
// Prevent duplicate reviews by the same user on the same product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

//======== DOCUMENT MIDDLEWARE PRE (save and find)=========

reviewSchema.pre(/^find/, function (this: Query<any, IReview>, next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//========= DOCUMENT MIDDLEWARE POST (save and find)========
// remove password from send data
reviewSchema.set('toObject', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

reviewSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Review = model<IReview>('Review', reviewSchema);
