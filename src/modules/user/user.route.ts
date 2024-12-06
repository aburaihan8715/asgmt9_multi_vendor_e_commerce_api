import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { UserController } from './user.controller';
import multerUpload from '../../utils/fileUpload';
import parseBodyString from '../../middlewares/parseBodyString';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = Router();

router.post(
  '/register',
  multerUpload.single('file'),
  parseBodyString(),
  validateRequest(UserValidation.createValidationSchema),
  UserController.register,
);

router.patch(
  '/profile-update/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.customer,
    USER_ROLE.vendor,
  ),
  multerUpload.single('file'),
  parseBodyString(),
  validateRequest(UserValidation.updateProfileValidationSchema),
  UserController.updateProfile,
);

router.patch(
  '/make-admin/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserController.makeAdmin,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserController.getAllUsers,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserController.deleteUser,
);

router.get(
  '/me',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.customer,
    USER_ROLE.vendor,
  ),
  UserController.getMe,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserController.getSingleUser,
);

export const UserRouter = router;
