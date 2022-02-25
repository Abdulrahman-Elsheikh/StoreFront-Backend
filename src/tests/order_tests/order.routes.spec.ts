import supertest from 'supertest';
import UserStore from '../../models/user.model';
import ProductStore from '../../models/product.model';
import OrderStore from '../../models/order.model';
import db from '../../database/database';
import User from '../../types/user.type';
import Product from '../../types/product.type';
import Order from '../../types/order.type';
import OrderProduct from '../../types/orderproduct.type';
import app from '../../server';

const request = supertest(app);
const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();
let token = '';

describe('Order API endpoints', () => {
  const user = {
    email: 'test@order.com',
    user_name: 'testUser',
    first_name: 'Test',
    last_name: 'User',
    password: 'test123',
  } as User;

  const product = {
    name: 'ProductForOrder',
    price: 77,
    category: 'Testing',
  } as Product;

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

  describe('Test Authentication Routes', () => {
    it('Should be able to authenticate and get token', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-Type', 'application/json')
        .send({ email: 'test@order.com', password: 'test123' });
      expect(res.status).toBe(200);
      const { id, email, token: userToken } = res.body.data;
      expect(id).toBe(user.id);
      expect(email).toBe(user.email);
      token = userToken;
    });

    it('Should be Failed with Wrong Email', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-Type', 'application/json')
        .send({ email: 'wrong-email@test.com', password: 'fake-test123' });
      expect(res.status).toBe(401);
    });
  });

  describe('Test CRUD API Operations', () => {
    it('Should Create a new order', async () => {
      const res = await request
        .post('/api/orders/')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_id: user.id,
          status: 'completed',
        } as Order);
      expect(res.status).toBe(200);
      const { id, user_id, status } = res.body.data;
      expect(id).toBe(res.body.data.id);
      expect(user_id).toBe(user.id);
      expect(status).toBe('completed');
    });

    it('Should update an order status', async () => {
      const res = await request
        .patch(`/api/orders/`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...order,
          status: 'active',
        });
      expect(res.status).toBe(200);
      const { id, user_id, status } = res.body.data;
      expect(id).toBe(res.body.data.id);
      expect(user_id).toBe(user.id);
      expect(status).toBe('active');
    });

    it('Should get a list of orders for a user', async () => {
      const res = await request
        .get(`/api/orders/${user.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('Should get a list of completed orders for a user', async () => {
      const res = await request
        .get(`/api/orders/completed/${user.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it('Should add a product to an order', async () => {
      const res = await request
        .post(`/api/orders/product/${order.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          order_id: order.id,
          product_id: product.id,
          quantity: 55,
        } as OrderProduct);
      expect(res.status).toBe(200);
      const { id, order_id, product_id, quantity } = res.body.data;
      expect(id).toBe(res.body.data.id);
      expect(order_id).toBe(order.id);
      expect(product_id).toBe(product.id);
      expect(quantity).toBe(55);
    });

    it('Should remove a product from an order', async () => {
      const res = await request
        .delete(`/api/orders/product/${order.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          order_id: order.id,
          product_id: product.id,
          quantity: 55,
        } as OrderProduct);
      expect(res.status).toBe(200);
      const { id, order_id, product_id, quantity } = res.body.data;
      expect(id).toBe(res.body.data.id);
      expect(order_id).toBe(order.id);
      expect(product_id).toBe(product.id);
      expect(quantity).toBe(55);
    });

    it('Should delete an order', async () => {
      const res = await request
        .delete(`/api/orders/${order.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(order.id);
      expect(res.body.data.user_id).toBe(user.id);
      expect(res.body.data.status).toBe('active');
    });
  });
});
