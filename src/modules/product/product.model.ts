/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query, Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensures price is non-negative
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  // category: categorySchema,
  inventoryCount: {
    type: Number,
    required: true,
    min: 0, // Ensures inventory is non-negative
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  discount: {
    type: Number,
    default: 0,
    min: 0, // Ensures discount is non-negative
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  // shop: shopSchema,
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // vendor: userSchema,
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

// NOTE: select only necessary fields
productSchema.pre(/^find/, function (this: Query<any, IProduct>, next) {
  this.find({ isDeleted: { $ne: true } });
  // .populate({
  //   path: 'shop',
  //   populate: { path: 'vendor' },
  // })
  // .populate({ path: 'category' });
  next();
});

//========= 02 DOCUMENT MIDDLEWARE POST (save and find)========
//========= 03 STATICS METHODS ========
//========= 04 INSTANCES METHODS ========
//========= 05 TRANSFORM ALL RETURN DOCUMENT ========
// these are remove __v from all return data
productSchema.set('toObject', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

productSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Product = model<IProduct>('Product', productSchema);
