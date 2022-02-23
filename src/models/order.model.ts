import Order from '../types/order.type';
import OrderProduct from '../types/orderproduct.type';
import db from '../database/database';

class OrderStore {
  // Create a New Order
  async createOrder(o: Order): Promise<Order> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *`;
      const result = await connection.query(sql, [o.user_id, o.status]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create (${o.id}): ${(error as Error).message}`
      );
    }
  }
  // Update an Order
  async updateOrderStatus(o: Order): Promise<Order> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE orders SET status=$2 WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [o.id, o.status]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to update status for order (${o.id}): ${
          (error as Error).message
        }`
      );
    }
  }
  // Get User Orders
  async getUserOrders(user_id: string): Promise<Order[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM orders WHERE user_id = $1`;
      const result = await connection.query(sql, [user_id]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Unable to get orders for user (${user_id}): ${
          (error as Error).message
        }`
      );
    }
  }
  // Add Product to order
  async addProductToOrder(
    order_id: string,
    product_id: string,
    quantity: number
  ): Promise<OrderProduct> {
    try {
      const connection = await db.connect();
      const orderSql = `SELECT * FROM orders WHERE id=$1`;
      const result = await connection.query(orderSql, [order_id]);
      const order = result.rows[0];

      if (order.status !== 'active') {
        throw new Error(
          `Unable to add product (${product_id}) to order (${order_id}) because order status is ${order.status}`
        );
      }
      connection.release();
    } catch (error) {
      throw new Error(
        `Unable to add product (${product_id}) to order (${order_id}): ${
          (error as Error).message
        }`
      );
    }

    try {
      const connection = await db.connect();
      const sql = `INSERT INTO orderproduct (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
      const result = await connection.query(sql, [
        order_id,
        product_id,
        quantity,
      ]);
      const order: OrderProduct = result.rows[0];
      connection.release();
      return order;
    } catch (error) {
      throw new Error(
        `Unable to add product (${product_id}) to order (${order_id}): ${
          (error as Error).message
        }`
      );
    }
  }
  // Get Complete Orders
  async getCompletedOrders(user_id: string): Promise<Order[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM orders WHERE user_id = $1 AND status = $2;`;
      const result = await connection.query(sql, [user_id, 'completed']);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Unable to get completed orders for user (${user_id}): ${
          (error as Error).message
        }`
      );
    }
  }
}

export default OrderStore;
