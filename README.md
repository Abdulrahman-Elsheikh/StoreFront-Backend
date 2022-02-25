# Storefront Backend Project

## Getting Started

To Get Started With Server you can run in terminal `yarn dev`.
And You Can Connect Database `store_dev` for developing & `store_test` for testing.
The Server is running on port 5000 that defined in .env file.
The Testing can run in terminal with command `yarn test`.

## Required Technologies

Your application must make use of the following libraries:

- Postgres for the database.
- Node/Express for the application logic.
- dotenv from npm for managing environment variables.
- db-migrate from npm for migrations.
- jsonwebtoken from npm for working with JWTs.
- jasmine from npm for testing.
- bcrypt from npm for hashing.
- supertest from npm for testing endpoints.

## Environment Variables

- PORT=5000
- ENV=dev
- POSTGRES_HOST=localhost
- POSTGRES_PORT=5432
- POSTGRES_DB=store_dev
- POSTGRES_DB_TEST=store_test
- POSTGRES_USER=postgres
- POSTGRES_PASSWORD=postgres
- SECRET_KEY=secretKey
- SALT_ROUNDS=10
- TOKEN_SECRET=secretToken
