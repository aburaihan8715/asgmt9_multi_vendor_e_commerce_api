import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';

import auth from '../../middlewares/auth';
import { CategoryValidation } from './category.validation';
import { CategoryController } from './category.controller';
import { USER_ROLE } from '../user/user.constant';
import parseBodyString from '../../middlewares/parseBodyString';
import CategoryImageUpload from './category.utils';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CategoryImageUpload.single('file'),
  parseBodyString(),
  validateRequest(CategoryValidation.createValidationSchema),
  CategoryController.createCategory,
);

router.get('/', CategoryController.getAllCategories);

router.get('/:id', CategoryController.getSingleCategory);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CategoryValidation.updateValidationSchema),
  CategoryController.updateCategory,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CategoryController.deleteCategory,
);

export const CategoryRouter = router;
