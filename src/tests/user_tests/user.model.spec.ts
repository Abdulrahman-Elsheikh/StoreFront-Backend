import UserStore from '../../models/user.model';
import db from '../../database/database';
import User from '../../types/user.type';

const userStore = new UserStore();

describe('User Model Module', () => {
  describe('Test methods exists', () => {
    it('Should have a get all users method', () => {
      expect(userStore.getAllUsers).toBeDefined();
    });

    it('Should have a get user method', () => {
      expect(userStore.getUser).toBeDefined();
    });

    it('Should have a create user method', () => {
      expect(userStore.createUser).toBeDefined();
    });

    it('Should have a update user method', () => {
      expect(userStore.updateUser).toBeDefined();
    });

    it('Should have a delete user method', () => {
      expect(userStore.deleteUser).toBeDefined();
    });

    it('Should have a authenticate user method', () => {
      expect(userStore.authenticateUser).toBeDefined();
    });
  });

  describe('Test User Model Logic', () => {
    const user = {
      email: 'test@user.com',
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
      const altrUsers = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';
      await connection.query(sql);
      await connection.query(altrUsers);
      connection.release();
    });

    it('Should return a new user', async () => {
      const createdUser = await userStore.createUser({
        email: 'test2@test.com',
        user_name: 'test2User',
        first_name: 'Test2',
        last_name: 'User',
        password: 'test123',
      } as User);
      expect(createdUser).toEqual({
        id: createdUser.id,
        email: 'test2@test.com',
        user_name: 'test2User',
        first_name: 'Test2',
        last_name: 'User',
      } as User);
    });

    it('Should return all users', async () => {
      const users = await userStore.getAllUsers();
      expect(users.length).toBe(2);
    });

    it('Should return a specific user', async () => {
      const returnedUser: User = await userStore.getUser(user.id as number);
      expect(returnedUser.id).toBe(user.id);
      expect(returnedUser.email).toBe(user.email);
      expect(returnedUser.user_name).toBe(user.user_name);
      expect(returnedUser.first_name).toBe(user.first_name);
      expect(returnedUser.last_name).toBe(user.last_name);
    });

    it('Should update a specific user', async () => {
      const updatedUser = await userStore.updateUser({
        ...user,
        user_name: 'testUser Updated',
        first_name: 'TestUser',
        last_name: 'Updated',
      } as User);
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.email).toBe(user.email);
      expect(updatedUser.user_name).toBe('testUser Updated');
      expect(updatedUser.first_name).toBe('TestUser');
      expect(updatedUser.last_name).toBe('Updated');
    });

    it('Should delete a specific user', async () => {
      const deletedUser = await userStore.deleteUser(user.id as number);
      expect(deletedUser.id).toBe(user.id);
    });
  });
});
