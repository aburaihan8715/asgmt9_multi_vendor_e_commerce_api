import { Router } from 'express';
import { UserRouter } from '../modules/user/user.route';
import { AuthRouter } from '../modules/auth/auth.route';
import { CategoryRouter } from '../modules/category/category.route';
import { ShopRouter } from '../modules/shop/shop.route';
import { ProductRouter } from '../modules/product/product.route';
import { OrderRouter } from '../modules/order/order.route';
import { ReviewRouter } from '../modules/review/review.route';
import { CartRouter } from '../modules/cart/cart.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/users',
    route: UserRouter,
  },
  {
    path: '/categories',
    route: CategoryRouter,
  },
  {
    path: '/shops',
    route: ShopRouter,
  },
  {
    path: '/products',
    route: ProductRouter,
  },
  {
    path: '/orders',
    route: OrderRouter,
  },
  {
    path: '/reviews',
    route: ReviewRouter,
  },
  {
    path: '/carts',
    route: CartRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
