CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE orderproduct(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id uuid NOT NULL REFERENCES orders(id),
    product_id uuid NOT NULL REFERENCES products(id),
    quantity integer NOT NULL
);