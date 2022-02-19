import User from '../types/user.type';
import db from '../database/database';
import config from '../middlewares/config';
import bcrypt from 'bcrypt';

const hashPassword = (password: string) => {
  const salt = parseInt(config.salt as string, 10);
  return bcrypt.hashSync(`${password}${config.pepper}`, salt);
};

class UserStore {
  // Create User
  async createUser(u: User): Promise<User> {
    try {
      // Connect to database
      const connection = await db.connect();
      // Run Query
      const sql = `INSERT INTO users (email, user_name, first_name, last_name, password)
      values ($1, $2, $3, $4, $5) returning id, email, user_name, first_name, last_name`;
      const result = await connection.query(sql, [
        u.email,
        u.user_name,
        u.first_name,
        u.last_name,
        hashPassword(u.password),
      ]);
      // Release connection
      connection.release();
      // Return Created User
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create (${u.user_name}): ${(error as Error).message}`
      );
    }
  }
  // Get All Users
  async getAllUsers(): Promise<User[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT id, email, user_name, first_name, last_name FROM users`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Can't get all users: ${(error as Error).message}`);
    }
  }
  // Get Specific User
  async getUser(id: string): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `SELECT id, email, user_name, first_name, last_name FROM users WHERE id = $1`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Can't find user with id ${id}, ${(error as Error).message}`
      );
    }
  }
  // Update User
  async updateUser(u: User): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE users SET email=$1, user_name=$2, first_name=$3, last_name=$4, password=$5 WHERE id=$6 RETURNING id, email, user_name, first_name, last_name`;
      const result = await connection.query(sql, [
        u.email,
        u.user_name,
        u.first_name,
        u.last_name,
        hashPassword(u.password),
        u.id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Can't update user: ${u.user_name}, ${(error as Error).message}`
      );
    }
  }
  // Delete User
  async deleteUser(id: string): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM users WHERE id=($1) RETURNING id, email, user_name, first_name, last_name`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Can't delete user with id ${id}, ${(error as Error).message}`
      );
    }
  }
  // Authenticate User
}

export default UserStore;
