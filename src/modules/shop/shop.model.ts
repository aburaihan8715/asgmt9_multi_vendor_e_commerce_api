/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query, Schema, model } from 'mongoose';
import { IShop } from './shop.interface';

const shopSchema = new Schema<IShop>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    default: '',
  },

  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  followers: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },

  followersCount: {
    type: Number,
    default: 0,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//======== 01 DOCUMENT MIDDLEWARE PRE (save and find)=========

shopSchema.pre(/^find/, function (this: Query<any, IShop>, next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//========= 02 DOCUMENT MIDDLEWARE POST (save and find)========
//========= 03 TRANSFORM ALL RETURN DOCUMENT ========
// these are remove __v from all return data
shopSchema.set('toObject', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

shopSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Shop = model<IShop>('Shop', shopSchema);
