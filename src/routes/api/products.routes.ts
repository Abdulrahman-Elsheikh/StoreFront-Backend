import { Router } from 'express';
import * as controllers from '../../controllers/products.controllers';
import authenticationMiddleware from '../../middlewares/authentication.middleware';

const routes = Router();

routes
  .route('/')
  .get(controllers.getAllProducts)
  .post(authenticationMiddleware, controllers.createProduct);
routes
  .route('/:id')
  .get(controllers.getProduct)
  .patch(authenticationMiddleware, controllers.updateProduct)
  .delete(authenticationMiddleware, controllers.deleteProduct);

export default routes;
