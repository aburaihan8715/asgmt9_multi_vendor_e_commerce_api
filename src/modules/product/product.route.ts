import { Router } from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { ProductController } from './product.controller';
import parseBodyString from '../../middlewares/parseBodyString';
import ProductsImagesUpload from './product.utils';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.vendor),
  ProductsImagesUpload.array('files', 2),
  parseBodyString(),
  ProductController.createProduct,
);

// GET NEW 5
router.get(
  '/featured-products',
  ProductController.getFeaturedProducts,
  ProductController.getAllProducts,
);

router.get('/', ProductController.getAllProducts);
router.get(
  '/all-by-follow-shop',
  auth(USER_ROLE.customer),
  ProductController.getAllProductsByFollowedShop,
);

router.get('/:id', ProductController.getSingleProduct);

router.patch(
  '/:id',
  auth(USER_ROLE.vendor),
  ProductsImagesUpload.array('files', 2),
  parseBodyString(),
  ProductController.updateProduct,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.vendor),
  ProductController.deleteProduct,
);

export const ProductRouter = router;
