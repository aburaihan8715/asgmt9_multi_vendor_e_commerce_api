import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';
import { CategoryService } from './category.service';
import { IFile } from '../../interface/file.interface';

// CREATE CATEGORY
const createCategory = catchAsync(async (req, res) => {
  const newCategory = await CategoryService.createCategoryIntoDB(
    req.file as IFile,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category created successfully!',
    data: newCategory,
  });
});

// UPDATE CATEGORY
const updateCategory = catchAsync(async (req, res) => {
  const updatedCategory = await CategoryService.updateCategoryIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully',
    data: updatedCategory,
  });
});

// GET ALL CATEGORIES
const getAllCategories = catchAsync(async (req, res) => {
  const categories = await CategoryService.getAllCategoriesFromDB();

  if (!categories || categories.length < 1) {
    return sendNotFoundDataResponse(res);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All categories retrieved successfully!',
    data: categories,
  });
});

// GET SINGLE CATEGORY
const getSingleCategory = catchAsync(async (req, res) => {
  const category = await CategoryService.getSingleCategoryFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category retrieved successfully!',
    data: category,
  });
});

// DELETE CATEGORY
const deleteCategory = catchAsync(async (req, res) => {
  const deleteCategory = await CategoryService.deleteCategoryFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully!',
    data: deleteCategory,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
