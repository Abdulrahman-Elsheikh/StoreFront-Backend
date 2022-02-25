import UserStore from '../../models/user.model';
import db from '../../database/database';
import User from '../../types/user.type';

const userStore = new UserStore();

describe('Authentication Module', () => {
  describe('Test methods exists', () => {
    it('Should has an authentication user method', () => {
      expect(userStore.authenticateUser).toBeDefined();
    });
  });

  describe('Test Authentication Logic', () => {
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
      const altrUsers = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';
      await connection.query(sql);
      await connection.query(altrUsers);
      connection.release();
    });

    it('Should return the authenticated user', async () => {
      const authenticatedUser = await userStore.authenticateUser(
        user.email,
        user.password as string
      );
      expect(authenticatedUser?.email).toBe(user.email);
      expect(authenticatedUser?.user_name).toBe(user.user_name);
      expect(authenticatedUser?.first_name).toBe(user.first_name);
      expect(authenticatedUser?.last_name).toBe(user.last_name);
    });

    it('Should return null for invalid user', async () => {
      const authenticatedUser = await userStore.authenticateUser(
        'wrong@email.com',
        'wrong-password'
      );
      expect(authenticatedUser).toBe(null);
    });
  });
});
