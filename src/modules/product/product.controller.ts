import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
// import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';
import { ProductService } from './product.service';
import { TFiles } from '../../interface/file.interface';
import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';
import { NextFunction, Request, Response } from 'express';

const createProduct = catchAsync(async (req, res) => {
  const vendorId = req.user._id;
  const newProduct = await ProductService.createProductIntoDB(
    vendorId,
    req.files as TFiles,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully!',
    data: newProduct,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const updatedProduct = await ProductService.updateProductIntoDB(
    req.params.id,
    req.user._id,
    req.files as TFiles,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct,
  });
});

// get featured products
const getFeaturedProducts = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.query.limit = '5';
  // req.query.sort = '';
  // req.query.fields = '';
  next();
};
const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProductsFromDB(req.query);

  if (!result || result?.result.length < 1) {
    return sendNotFoundDataResponse(res);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Products retrieved successfully!',
    data: result,
  });
});

const getAllProductsByFollowedShop = catchAsync(async (req, res) => {
  const customerId = req.user._id;
  const result = await ProductService.getAllProductsByFollowedShopFromDB(
    req.query,
    customerId,
  );

  if (!result || result?.result.length < 1) {
    return sendNotFoundDataResponse(res);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Products retrieved successfully!',
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const product = await ProductService.getSingleProductFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully!',
    data: product,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const deleteProduct = await ProductService.deleteProductFromDB(
    req.params.id,
    req.user._id,
    req.user.role,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully!',
    data: deleteProduct,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getAllProductsByFollowedShop,
  getFeaturedProducts,
};
