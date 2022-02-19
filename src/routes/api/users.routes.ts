import { Router } from 'express';
import * as controllers from '../../controllers/users.controllers';
import authenticationMiddleware from '../../middlewares/authentication.middleware';

const routes = Router();

routes
  .route('/')
  .get(authenticationMiddleware, controllers.getAllUsers)
  .post(controllers.createUser);
routes
  .route('/:id')
  .get(controllers.getUser)
  .patch(controllers.updateUser)
  .delete(controllers.deleteUser);

routes.route('/authenticate').post(controllers.authenticateUser);

export default routes;
