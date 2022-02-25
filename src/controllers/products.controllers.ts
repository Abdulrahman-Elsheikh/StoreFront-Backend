import { Request, Response, NextFunction } from 'express';
import ProductStore from '../models/product.model';

const productStore = new ProductStore();

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productStore.createProduct(req.body);
    res.json({
      status: 'success',
      message: 'Product Created Successfully',
      data: { ...product },
    });
  } catch (error) {
    next(error);
  }
};
export const getAllProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await productStore.getAllProducts();
    res.json({
      status: 'success',
      message: 'Products Retrieved Successfully',
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productStore.getProduct(
      req.params.id as unknown as number
    );
    res.json({
      status: 'success',
      message: 'Product Retrieved Successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
export const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await productStore.getProductsByCategory(
      req.params.category as unknown as string
    );
    res.json({
      status: 'success',
      message: `Products with Category ${req.params.category} Retrieved Successfully`,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productStore.updateProduct(req.body);
    res.json({
      status: 'success',
      message: 'User Updated Successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productStore.deleteProduct(
      req.params.id as unknown as number
    );
    res.json({
      status: 'success',
      message: 'Product Deleted Successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
