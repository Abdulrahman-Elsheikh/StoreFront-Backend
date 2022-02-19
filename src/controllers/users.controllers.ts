import { Request, Response, NextFunction } from 'express';
import UserStore from '../models/user.model';
import jwt from 'jsonwebtoken';
import config from '../middlewares/config';

const userStore = new UserStore();

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userStore.createUser(req.body);
    res.json({
      status: 'success',
      message: 'User Created Successfully',
      data: { ...user },
    });
  } catch (error) {
    next(error);
  }
};
export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userStore.getAllUsers();
    res.json({
      status: 'success',
      message: 'Users Retrieved Successfully',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userStore.getUser(req.params.id as unknown as string);
    res.json({
      status: 'success',
      message: 'User Retrieved Successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userStore.updateUser(req.body);
    res.json({
      status: 'success',
      message: 'User Updated Successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userStore.deleteUser(req.params.id as unknown as string);
    res.json({
      status: 'success',
      message: 'User Deleted Successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await userStore.authenticateUser(email, password);
    const token = jwt.sign({ user }, config.tokenSecret as unknown as string);
    if (!user) {
      return res.status(401).json({
        status: '401 Unauthorized',
        message: 'The username and password do not match',
      });
    }
    return res.json({
      status: 'success',
      message: 'User authenticated Successfully',
      data: { ...user, token },
    });
  } catch (error) {
    next(error);
  }
};
