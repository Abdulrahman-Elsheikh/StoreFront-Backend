import Product from '../types/product.type';
import db from '../database/database';

class ProductStore {
  // Create Product
  async createProduct(p: Product): Promise<Product> {
    try {
      // Connect to database
      const connection = await db.connect();
      // Run Query
      const sql = `INSERT INTO products (name, price, category)
      values ($1, $2, $3) RETURNING *`;
      const result = await connection.query(sql, [p.name, p.price, p.category]);
      // Release connection
      connection.release();
      // Return Created User
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create (${p.name}): ${(error as Error).message}`
      );
    }
  }
  // Get All Product
  async getAllProducts(): Promise<Product[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM products`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Can't get all products: ${(error as Error).message}`);
    }
  }
  // Get A Specific Product
  async getProduct(id: string): Promise<Product> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM products WHERE id = $1`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Can't find product with id ${id}, ${(error as Error).message}`
      );
    }
  }
  // Get Products By Category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM products WHERE category = $1`;
      const result = await connection.query(sql, [category]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Can't find products with category ${category}, ${
          (error as Error).message
        }`
      );
    }
  }
  // Update Product
  async updateProduct(p: Product): Promise<Product> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE products SET name=$1, price=$2, category=$3 WHERE id=$4 RETURNING *`;
      const result = await connection.query(sql, [
        p.name,
        p.price,
        p.category,
        p.id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Can't update product: ${p.name}, ${(error as Error).message}`
      );
    }
  }
  // Delete Product
  async deleteProduct(id: string): Promise<Product> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM products WHERE id=($1) RETURNING *`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Can't delete product with id ${id}, ${(error as Error).message}`
      );
    }
  }
}

export default ProductStore;
