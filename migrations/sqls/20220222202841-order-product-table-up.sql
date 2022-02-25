CREATE TABLE orderproduct(
    id SERIAL PRIMARY KEY,
    order_id integer NOT NULL REFERENCES orders(id),
    product_id integer NOT NULL REFERENCES products(id),
    quantity integer NOT NULL
);