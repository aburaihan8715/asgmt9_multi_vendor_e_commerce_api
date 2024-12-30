import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';

import auth from '../../middlewares/auth';
import { OrderValidation } from './order.validation';
import { OrderController } from './order.controller';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

//////////// Order Related /////////////////
router.post('/', auth(USER_ROLE.customer), OrderController.addOrder);

router.get('/', OrderController.getAllCategories);

router.get('/:id', OrderController.getSingleOrder);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(OrderValidation.updateValidationSchema),
  OrderController.updateOrder,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OrderController.deleteOrder,
);

//////////// Payment Related /////////////////

router.post(
  '/create-payment-intent',
  auth(USER_ROLE.customer),
  validateRequest(OrderValidation.createPaymentIntentValidation),
  OrderController.createPaymentIntent,
);

export const OrderRouter = router;
