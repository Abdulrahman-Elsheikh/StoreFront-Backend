import { Request, Response, NextFunction } from 'express';
import OrderStore from '../models/order.model';

const orderStore = new OrderStore();

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await orderStore.createOrder(req.body);
    res.json({
      status: 'success',
      message: 'Order Created Successfully',
      data: { ...order },
    });
  } catch (error) {
    next(error);
  }
};
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await orderStore.updateOrderStatus(req.body);
    res.json({
      status: 'success',
      message: 'Order Status Updated Successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
export const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await orderStore.getUserOrders(
      req.params.id as unknown as number
    );
    res.json({
      status: 'success',
      message: 'Orders Retrieved Successfully',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
export const addProductToOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await orderStore.addProductToOrder(
      req.body.order_id as unknown as number,
      req.body.product_id as unknown as number,
      req.body.quantity as unknown as number
    );
    res.json({
      status: 'success',
      message: 'Product Added to ORDER Successfully',
      data: { ...order },
    });
  } catch (error) {
    next(error);
  }
};
export const getCompletedOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await orderStore.getCompletedOrders(
      req.params.id as unknown as number
    );
    res.json({
      status: 'success',
      message: 'Orders Retrieved Successfully',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await orderStore.deleteOrder(
      req.params.id as unknown as number
    );
    res.json({
      status: 'success',
      message: 'Order Deleted Successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
export const removeProductFromOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await orderStore.removeProductFromOrder(
      req.body.order_id as unknown as number,
      req.body.product_id as unknown as number,
      req.body.quantity as unknown as number
    );
    res.json({
      status: 'success',
      message: 'Product Removed From Order Successfully',
      data: { ...order },
    });
  } catch (error) {
    next(error);
  }
};
