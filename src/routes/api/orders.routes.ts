import { Router } from 'express';
import * as controllers from '../../controllers/order.controllers';
import authenticationMiddleware from '../../middlewares/authentication.middleware';

const routes = Router();

routes
  .route('/')
  .post(authenticationMiddleware, controllers.createOrder)
  .patch(authenticationMiddleware, controllers.updateOrderStatus);

routes
  .route('/:id')
  .get(authenticationMiddleware, controllers.getUserOrders)
  .delete(authenticationMiddleware, controllers.deleteOrder);

routes
  .route('/completed/:id')
  .get(authenticationMiddleware, controllers.getCompletedOrders);

routes
  .route('/product/:id')
  .post(authenticationMiddleware, controllers.addProductToOrder)
  .delete(authenticationMiddleware, controllers.removeProductFromOrder);

export default routes;
