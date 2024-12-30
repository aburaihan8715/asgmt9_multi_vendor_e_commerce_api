/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, IUserModel } from './user.interface';
import envConfig from '../../config/env.config';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  profilePhoto: {
    type: String,
    default: '',
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (passwordConfirmValue): boolean {
        return passwordConfirmValue === this.password;
      },
      message: 'Password are not the same!',
    },
  },

  passwordChangedAt: {
    type: Date,
    default: null,
  },

  role: {
    type: String,
    enum: ['superAdmin', 'admin', 'customer', 'vendor'],
    default: 'customer',
  },

  address: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
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
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 10
  this.password = await bcrypt.hash(
    this.password,
    Number(envConfig.BCRYPT_SALT_ROUNDS),
  );

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(/^find/, function (this: Query<any, IUser>, next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//========= 02 DOCUMENT MIDDLEWARE POST (save and find)========

//========= 03 TRANSFORM ALL RETURN DOCUMENTS ========
// remove password (if exists) and __v from any return documents
userSchema.set('toObject', {
  transform: (_doc, ret) => {
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

//============ 04 STATIC METHODS ==============
userSchema.statics.getUserById = async function (id: string) {
  return await User.findOne({ _id: id }).select('+password');
};

userSchema.statics.getUserByEmail = async function (email: string) {
  return await User.findOne({ email: email }).select('+password');
};

userSchema.statics.isPasswordCorrect = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isPasswordChangedAfterJwtIssued = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, IUserModel>('User', userSchema);
