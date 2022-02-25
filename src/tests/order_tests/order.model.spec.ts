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
      user_id: 1,
      status: 'test',
    } as Order;

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
      const orderSql = 'DELETE FROM orders;';
      const altrOrders = 'ALTER SEQUENCE products_id_seq RESTART WITH 1;';
      const productSql = 'DELETE FROM products;';
      const altrProducts = 'ALTER SEQUENCE products_id_seq RESTART WITH 1;';
      const userSql = 'DELETE FROM users;';
      const altrUsers = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';
      await connection.query(orderSql);
      await connection.query(altrOrders);
      await connection.query(productSql);
      await connection.query(altrProducts);
      await connection.query(userSql);
      await connection.query(altrUsers);
      connection.release();
    });

    it('Should create a new order', async () => {
      const createdOrder = await orderStore.createOrder({
        user_id: user.id,
        status: 'completed',
      } as Order);
      expect(createdOrder).toEqual({
        id: createdOrder.id,
        user_id: user.id,
        status: 'completed',
      } as Order);
    });

    it('Should update an order status', async () => {
      const updatedOrder = await orderStore.updateOrderStatus({
        ...order,
        status: 'active',
      } as Order);
      expect(updatedOrder.id).toBe(order.id);
      expect(updatedOrder.user_id).toBe(order.user_id);
      expect(updatedOrder.status).toBe('active');
    });

    it('Should return all orders for user', async () => {
      const orders = await orderStore.getUserOrders(user.id as number);
      expect(orders.length).toBe(2);
    });

    it('Should return all completed orders for user', async () => {
      const orders = await orderStore.getCompletedOrders(user.id as number);
      expect(orders.length).toBe(1);
    });

    it('Should add a product to an order', async () => {
      const returnedOrder: OrderProduct = await orderStore.addProductToOrder(
        order.id as number,
        product.id as number,
        83
      );
      expect(returnedOrder.id).toBe(returnedOrder.id);
      expect(returnedOrder.order_id).toBe(order.id as number);
      expect(returnedOrder.product_id).toBe(product.id as number);
      expect(returnedOrder.quantity).toBe(83);
    });

    it('Should remove a product from an order', async () => {
      const removedProduct = await orderStore.removeProductFromOrder(
        order.id as number,
        product.id as number,
        83
      );
      expect(removedProduct.id).toBe(removedProduct.id);
      expect(removedProduct.order_id).toBe(order.id as number);
      expect(removedProduct.product_id).toBe(product.id as number);
      expect(removedProduct.quantity).toBe(83);
    });

    it('Should delete a specific order', async () => {
      const deletedOrder = await orderStore.deleteOrder(order.id as number);
      expect(deletedOrder.id).toBe(order.id);
    });
  });
});
