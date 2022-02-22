import supertest from 'supertest';
import UserStore from '../../models/user.model';
import ProductStore from '../../models/product.model';
import db from '../../database/database';
import User from '../../types/user.type';
import Product from '../../types/product.type';
import app from '../../server';

const request = supertest(app);
const userStore = new UserStore();
const productStore = new ProductStore();
let token = '';

describe('Product API endpoints', () => {
  const user = {
    email: 'test@product.com',
    user_name: 'testUser',
    first_name: 'Test',
    last_name: 'User',
    password: 'test123',
  } as User;

  const product = {
    name: 'testProduct',
    price: 70,
    category: 'Testing',
  } as Product;

  beforeAll(async () => {
    const createdUser = await userStore.createUser(user);
    user.id = createdUser.id;
    const createdProduct = await productStore.createProduct(product);
    product.id = createdProduct.id;
  });

  afterAll(async () => {
    const connection = await db.connect();
    const sql = 'DELETE FROM users;';
    const sql2 = 'DELETE FROM products;';
    await connection.query(sql);
    await connection.query(sql2);
    connection.release();
  });

  describe('Test Authentication Routes', () => {
    it('Should be able to authenticate and get token', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-Type', 'application/json')
        .send({ email: 'test@product.com', password: 'test123' });
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
    it('Should Create a new Product', async () => {
      const res = await request
        .post('/api/products/')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'testProduct2',
          price: 45,
          category: 'Testing2',
        } as Product);
      expect(res.status).toBe(200);
      const { name, price, category } = res.body.data;
      expect(name).toBe('testProduct2');
      expect(price).toBe(45);
      expect(category).toBe('Testing2');
    });

    it('Should get a list of products', async () => {
      const res = await request
        .get('/api/products/')
        .set('Content-Type', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('Should get a list of products with a specific', async () => {
      const res = await request
        .get(`/api/products/category/${product.category}`)
        .set('Content-Type', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it('Should get a product info', async () => {
      const res = await request
        .get(`/api/products/${product.id}`)
        .set('Content-Type', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('testProduct');
      expect(res.body.data.price).toBe(70);
      expect(res.body.data.category).toBe('Testing');
    });

    it('Should update a product info', async () => {
      const res = await request
        .patch(`/api/products/${product.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...product,
          name: 'testProductUpdated',
          price: 25,
          category: 'Updated',
        });
      expect(res.status).toBe(200);
      const { id, name, price, category } = res.body.data;
      expect(id).toBe(product.id);
      expect(name).toBe('testProductUpdated');
      expect(price).toBe(25);
      expect(category).toBe('Updated');
    });

    it('Should delete a product', async () => {
      const res = await request
        .delete(`/api/products/${product.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(product.id);
      expect(res.body.data.name).toBe('testProductUpdated');
      expect(res.body.data.price).toBe(25);
      expect(res.body.data.category).toBe('Updated');
    });
  });
});
