/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query, Schema, model } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

//======== DOCUMENT MIDDLEWARE PRE (save and find)=========

categorySchema.pre(/^find/, function (this: Query<any, ICategory>, next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//========= DOCUMENT MIDDLEWARE POST (save and find)========
// remove password from send data
categorySchema.set('toObject', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

categorySchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Category = model<ICategory>('Category', categorySchema);
