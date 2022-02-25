# API Requirements

You will find the endpoints for all functionality of the website & database schema (columns and types).

## API Endpoints

- The main route will get a welcome message.
- All Routes and endpoints will run on /api.

### Products

-Running On /api/products

- Get All Products [GET] => /api/products/
- Create Product [POST] => /api/products/ [token required]
- Get Product [GET] => /api/products/:id
- Update Product [PATCH] => /api/products/:id [token required]
- Delete Product [DELETE] => /api/products/:id [token required]
- Get Products By Category [GET] => /api/products/category/:category

### Users

-Running On /api/users

- Get All Users [GET] => /api/users [token required]
- Create User [POST] => /api/users
- Get User [GET] => /api/users/:id [token required]
- Update User [PATCH] => /api/users/:id [token required]
- Delete User [DELETE] => /api/users/:id [token required]
- Authenticate User [POST] => /api/users/authenticate

### Orders

-Running On /api/orders

- Create Order [POST] => /api/orders [token required]
- Update Order Status [PATCH] => /api/orders [token required]
- Get User Orders [GET] => /api/orders/:id [token required]
- Delete Order [DELETE] => /api/orders/:id [token required]
- Get Complete User Orders [GET] => /api/orders/completed/:id [token required]
- Add Product To Order [POST] => /api/orders/product/:id [token required]

## Data Shapes

### Products

- id => SERIAL PRIMARY KEY
- name => VARCHAR(50)
- price => INTEGER
- category => VARCHAR(50)

### Users

- id => SERIAL PRIMARY KEY
- email => VARCHAR(50)
- user_name => VARCHAR(50)
- first_name => VARCHAR(50)
- last_name => VARCHAR(50)
- password => VARCHAR(255)

### Orders

- id => SERIAL PRIMARY KEY
- user_id => INTEGER => REFERENCES users(id) 
- status => VARCHAR(50)

### Order-Products

- id => SERIAL PRIMARY KEY
- order_id => INTEGER => REFERENCES orders(id)
- product_id => INTEGER => REFERENCES products(id) 
- status => VARCHAR(50)