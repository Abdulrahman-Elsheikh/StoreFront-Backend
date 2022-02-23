import { Router } from 'express';
import * as controllers from '../../controllers/order.controllers';
import authenticationMiddleware from '../../middlewares/authentication.middleware';

const routes = Router();

routes
  .route('/')
  .post(authenticationMiddleware, controllers.createOrder)
  .patch(authenticationMiddleware, controllers.updateOrderStatus);

routes.route('/:id').get(authenticationMiddleware, controllers.getUserOrders);

routes
  .route('/completed/:id')
  .get(authenticationMiddleware, controllers.getCompletedOrders);

routes
  .route('/product')
  .post(authenticationMiddleware, controllers.addProductToOrder);

export default routes;
