import { Router } from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { ShopController } from './shop.controller';
import multerUpload from '../../utils/fileUpload';
import parseBodyString from '../../middlewares/parseBodyString';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.vendor),
  multerUpload.single('file'),
  parseBodyString(),
  ShopController.createShop,
);

router.get('/', ShopController.getAllShops);

router.get('/:id', ShopController.getSingleShop);

router.patch(
  '/:id',
  auth(USER_ROLE.vendor),
  multerUpload.single('file'),
  parseBodyString(),
  ShopController.updateShop,
);
router.patch(
  '/:id/follow',
  auth(USER_ROLE.customer),
  ShopController.followShop,
);
router.patch(
  '/:id/un-follow',
  auth(USER_ROLE.customer),
  ShopController.unFollowShop,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.vendor),
  ShopController.deleteShop,
);

export const ShopRouter = router;
