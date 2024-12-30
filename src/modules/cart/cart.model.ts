/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { ICart } from './cart.interface';
import { Product } from '../product/product.model';

const cartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
    unique: true,
  },

  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      _id: false,
    },
  ],
  totalItems: {
    type: Number,
    default: 0, // Default to 0
  },
  totalAmount: {
    type: Number,
    default: 0, // Default to 0
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//======== DOCUMENT MIDDLEWARE PRE (find)=========
// cartSchema.pre(/^find/, function (this: Query<any, ICart>, next) {
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });

//======== DOCUMENT MIDDLEWARE PRE (save)=========
cartSchema.pre('save', async function (next) {
  if (!this.isModified('items')) return next(); // Skip if `items` is not modified

  const cart = this;

  // Calculate total items
  cart.totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Fetch product prices and calculate total amount
  const productIds = cart.items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } }).select(
    'price',
  );

  const priceMap = products.reduce(
    (acc, product) => {
      acc[product._id.toString()] = product.price;
      return acc;
    },
    {} as Record<string, number>,
  );

  cart.totalAmount = cart.items.reduce((total, item) => {
    const price = priceMap[item.product.toString()] || 0;
    return total + item.quantity * price;
  }, 0);

  next();
});

//======== DOCUMENT MIDDLEWARE POST (find)=========

//========= TRANSFORMATION DATA ========
cartSchema.set('toObject', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

cartSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Cart = model<ICart>('Cart', cartSchema);
