import supertest from 'supertest';
import UserStore from '../models/user.model';
import db from '../database/database';
import User from '../types/user.type';
import app from '../server';

const request = supertest(app);
const userStore = new UserStore();
let token = '';

describe('User API endpoints', () => {
  const user = {
    email: 'test@test.com',
    user_name: 'testUser',
    first_name: 'Test',
    last_name: 'User',
    password: 'test123',
  } as User;

  beforeAll(async () => {
    const createdUser = await userStore.createUser(user);
    user.id = createdUser.id;
  });

  afterAll(async () => {
    const connection = await db.connect();
    const sql = 'DELETE FROM users;';
    await connection.query(sql);
    connection.release();
  });

  describe('Test Authentication Routes', () => {
    it('Should be able to authenticate and get token', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-Type', 'application/json')
        .send({ email: 'test@test.com', password: 'test123' });
      expect(res.status).toBe(200);
      const { id, email, token: userToken } = res.body.data;
      expect(id).toBe(user.id);
      expect(email).toBe('test@test.com');
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
    it('Should Create a new user', async () => {
      const res = await request
        .post('/api/users/')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test2@test.com',
          user_name: 'test2User2',
          first_name: 'Test2',
          last_name: 'User2',
          password: 'test123',
        } as User);
      expect(res.status).toBe(200);
      const { email, user_name, first_name, last_name } = res.body.data;
      expect(email).toBe('test2@test.com');
      expect(user_name).toBe('test2User2');
      expect(first_name).toBe('Test2');
      expect(last_name).toBe('User2');
    });

    it('Should get a list of users', async () => {
      const res = await request
        .get('/api/users/')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('Should get user info', async () => {
      const res = await request
        .get(`/api/users/${user.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.user_name).toBe('testUser');
      expect(res.body.data.email).toBe('test@test.com');
      expect(res.body.data.first_name).toBe('Test');
      expect(res.body.data.last_name).toBe('User');
    });

    it('Should update user info', async () => {
      const res = await request
        .patch(`/api/users/${user.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...user,
          user_name: 'testUserUpdated',
          first_name: 'TestUser',
          last_name: 'Updated',
        });
      expect(res.status).toBe(200);
      const { id, email, user_name, first_name, last_name } = res.body.data;
      expect(id).toBe(user.id);
      expect(email).toBe(user.email);
      expect(user_name).toBe('testUserUpdated');
      expect(first_name).toBe('TestUser');
      expect(last_name).toBe('Updated');
    });

    it('Should delete a user', async () => {
      const res = await request
        .delete(`/api/users/${user.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(user.id);
      expect(res.body.data.user_name).toBe('testUserUpdated');
    });
  });
});
