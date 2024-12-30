/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/AppError';
import { ICart } from './cart.interface';
import { Cart } from './cart.model';
import httpStatus from 'http-status';

const addCartIntoDB = async (userId: string, payload: ICart) => {
  const cartData = {
    user: userId,
    items: payload.items,
    shop: payload.shop,
  };

  console.log('payload', payload);
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create(cartData);
  } else {
    const isSameShop = cart.shop.toString() === payload.shop.toString();

    if (!isSameShop) {
      // Reset the cart for a different shop
      cart.shop = payload.shop;
      // Replace the items with the new payload items
      cart.items = payload.items;
      await cart.save();
      return cart;
    }

    // Check if any item in the payload already exists in the cart
    const existingItemIds = cart.items.map((item) =>
      item.product.toString(),
    );
    const duplicateItems = payload.items.filter((item) =>
      existingItemIds.includes(item.product.toString()),
    );

    if (duplicateItems.length > 0) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Already added this product!',
      );
    }

    // Add new items to the cart
    cart.items.push(...payload.items);
    await cart.save();
  }

  return cart;
};

const getCartFromDB = async (userId: string) => {
  const result = await Cart.find({ user: userId })
    .populate({
      path: 'items.product',
      select: 'name price description images',
    })
    .populate('shop')
    .populate('user');

  return result;
};

const incrementQuantityIntoDB = async (
  userId: string,
  productId: string,
) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart not found!');
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found in cart!');
  }

  // Increment quantity
  item.quantity += 1;

  // Recalculate total items and total amount
  cart.totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  cart.totalAmount = cart.items.reduce((total, item) => {
    const productPrice = (item.product as any).price || 0;
    return total + productPrice * item.quantity;
  }, 0);

  await cart.save();

  return cart;
};

const decrementQuantityIntoDB = async (
  userId: string,
  productId: string,
) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart not found!');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found in cart!');
  }

  const item = cart.items[itemIndex];

  // Decrement quantity or remove if quantity <= 1
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart.items.splice(itemIndex, 1);
  }

  // Recalculate total items and total amount
  cart.totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  cart.totalAmount = cart.items.reduce((total, item) => {
    const productPrice = (item.product as any).price || 0;
    return total + productPrice * item.quantity;
  }, 0);

  await cart.save();

  return cart;
};

const removeCartItemFromDB = async (productId: string, userId: string) => {
  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart not found!');
  }

  // Find the product in the cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found in cart!');
  }

  // Remove the product from the items array
  cart.items.splice(itemIndex, 1);

  // Recalculate total items and total amount
  cart.totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  cart.totalAmount = cart.items.reduce((total, item) => {
    const productPrice = (item.product as any).price || 0;
    return total + productPrice * item.quantity;
  }, 0);

  // Save the updated cart
  await cart.save();

  return cart;
};

const clearCartFromDB = async (cartId: string, userId: string) => {
  // Find and delete the cart
  const deletedData = await Cart.findOneAndDelete({
    _id: cartId,
    user: userId,
  });

  // Handle the case where no cart is found
  if (!deletedData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart not found!');
  }

  return deletedData;
};

export const CartService = {
  addCartIntoDB,
  getCartFromDB,
  incrementQuantityIntoDB,
  decrementQuantityIntoDB,
  clearCartFromDB,
  removeCartItemFromDB,
};
