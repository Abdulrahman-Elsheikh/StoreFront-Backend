import ProductStore from '../../models/product.model';
import db from '../../database/database';
import Product from '../../types/product.type';

const productStore = new ProductStore();

describe('Product Model Module', () => {
  describe('Test methods exists', () => {
    it('Should have a get all products method', () => {
      expect(productStore.getAllProducts).toBeDefined();
    });

    it('Should have a get product method', () => {
      expect(productStore.getProduct).toBeDefined();
    });

    it('Should have a get product method', () => {
      expect(productStore.getProductsByCategory).toBeDefined();
    });

    it('Should have a create product method', () => {
      expect(productStore.createProduct).toBeDefined();
    });

    it('Should have a update product method', () => {
      expect(productStore.updateProduct).toBeDefined();
    });

    it('Should have a delete product method', () => {
      expect(productStore.deleteProduct).toBeDefined();
    });
  });

  describe('Test Product Model Logic', () => {
    const product = {
      name: 'testProduct',
      price: 10,
      category: 'test',
    } as Product;

    beforeAll(async () => {
      const createdProduct = await productStore.createProduct(product);
      product.id = createdProduct.id;
    });

    afterAll(async () => {
      const connection = await db.connect();
      const sql = 'DELETE FROM products;';
      await connection.query(sql);
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
