import OrderStore from '../../models/order.model';
import ProductStore from '../../models/product.model';
import UserStore from '../../models/user.model';
import db from '../../database/database';
import Order from '../../types/order.type';
import OrderProduct from '../../types/orderproduct.type';
import Product from '../../types/product.type';
import User from '../../types/user.type';

const orderStore = new OrderStore();
const productStore = new ProductStore();
const userStore = new UserStore();

describe('Order Model Module', () => {
  describe('Test methods exists', () => {
    it('Should have a create order method', () => {
      expect(orderStore.createOrder).toBeDefined();
    });

    it('Should have a update order status method', () => {
      expect(orderStore.updateOrderStatus).toBeDefined();
    });

    it('Should have a get user orders method', () => {
      expect(orderStore.getUserOrders).toBeDefined();
    });

    it('Should have a get user completed orders method', () => {
      expect(orderStore.getCompletedOrders).toBeDefined();
    });

    it('Should have a delete order method', () => {
      expect(orderStore.deleteOrder).toBeDefined();
    });

    it('Should have a add product to order method', () => {
      expect(orderStore.addProductToOrder).toBeDefined();
    });

    it('Should have a remove product from order method', () => {
      expect(orderStore.removeProductFromOrder).toBeDefined();
    });
  });

  describe('Test Order Model Logic', () => {
    const product = {
      name: 'productForOrder',
      price: 36,
      category: 'testOrder',
    } as Product;

    const user = {
      email: 'test@order.com',
      user_name: 'testUser',
      first_name: 'Test',
      last_name: 'User',
      password: 'test123',
    } as User;

    const order = {
      user_id: user.id,
      status: 'active',
    } as Order;

    const orderproduct = {
      order_id: order.id,
      product_id: product.id,
      quantity: 23,
    } as OrderProduct;

    beforeAll(async () => {
      const createdUser = await userStore.createUser(user);
      user.id = createdUser.id;
      const createdProduct = await productStore.createProduct(product);
      product.id = createdProduct.id;
      const createdOrder = await orderStore.createOrder(order);
      order.id = createdOrder.id;
    });

    afterAll(async () => {
      const connection = await db.connect();
      const userSql = 'DELETE FROM users;';
      const productSql = 'DELETE FROM products;';
      const orderSql = 'DELETE FROM orders;';
      await connection.query(userSql);
      await connection.query(productSql);
      await connection.query(orderSql);
      connection.release();
    });

    it('Should return a new product', async () => {
      const createdProduct = await productStore.createProduct({
        name: 'test2Product',
        price: 20,
        category: 'test2',
      } as Product);
      expect(createdProduct).toEqual({
        id: createdProduct.id,
        name: 'test2Product',
        price: 20,
        category: 'test2',
      } as Product);
    });

    it('Should return all products', async () => {
      const products = await productStore.getAllProducts();
      expect(products.length).toBe(2);
    });

    it('Should return all products with a specific category', async () => {
      const products = await productStore.getProductsByCategory(
        product.category as string
      );
      expect(products.length).toBe(1);
    });

    it('Should return a specific product', async () => {
      const returnedProduct: Product = await productStore.getProduct(
        product.id as string
      );
      expect(returnedProduct.id).toBe(product.id);
      expect(returnedProduct.name).toBe(product.name);
      expect(returnedProduct.price).toBe(product.price);
      expect(returnedProduct.category).toBe(product.category);
    });

    it('Should update a specific product', async () => {
      const updatedProduct = await productStore.updateProduct({
        ...product,
        name: 'testProduct Updated',
        price: 500,
      } as Product);
      expect(updatedProduct.id).toBe(product.id);
      expect(updatedProduct.name).toBe('testProduct Updated');
      expect(updatedProduct.price).toBe(500);
      expect(updatedProduct.category).toBe(product.category);
    });

    it('Should delete a specific product', async () => {
      const deleteProduct = await productStore.deleteProduct(
        product.id as string
      );
      expect(deleteProduct.id).toBe(product.id);
    });
  });
});
