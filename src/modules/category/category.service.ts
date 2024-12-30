import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { ICategory } from './category.interface';
import { Category } from './category.model';
import { IFile } from '../../interface/file.interface';

// CREATE CATEGORY
const createCategoryIntoDB = async (file: IFile, payload: ICategory) => {
  if (file && file.path) {
    payload.image = file.path;
  }
  const result = await Category.create(payload);
  return result;
};

const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<ICategory>,
) => {
  const updatedCategory = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedCategory) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Category could not be updated!',
    );
  }

  // delete password form the user
  const { __v, ...remainingCategory } = updatedCategory.toObject();

  // return tokens and user to the controller
  return remainingCategory;
};

const getAllCategoriesFromDB = async () => {
  const categories = await Category.find({});

  return categories;
};

const getSingleCategoryFromDB = async (id: string) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found !');
  }

  return category;
};

const deleteCategoryFromDB = async (id: string) => {
  const deletedCategory = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found !');
  }

  return deletedCategory;
};

export const CategoryService = {
  createCategoryIntoDB,
  updateCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  deleteCategoryFromDB,
};
