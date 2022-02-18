import { Request, Response, NextFunction } from 'express';
import Error from '../interfaces/error.interface';

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  res.status(status).json({ status, message });
};

export default errorMiddleware;
