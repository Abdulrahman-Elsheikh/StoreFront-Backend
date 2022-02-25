# Storefront Backend Project

## Getting Started

To Get Started With Server you can run in terminal `yarn dev`.
And You Can Connect Database `store_dev` for developing & `store_test` for testing.
The Server is running on port 5000 that defined in .env file.
The Testing can run in terminal with command `yarn test`.

## Setup Database

- For database we use Postgres
- You should create .env & database.json files and configure environment variables [check environment variables section at the end of the file]
- In terminal you should connect the database server using `psql -U <Database User> -h <Database Host>`
- Then you should enter the database password `<Database Password>`
- Then you should connect the database using `\c <Default Database or Test Database>`
- Now you are connected to the database

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

- APP_NAME=Application Name [The Application Name]
- APP_URL=Application URL [Application Server Base URL <http://localhost:PORT>]
- ENV=dev [Application Environment For Development]
- ENV=test [Application Environment For Test]
- POSTGRES_HOST=localhost [Application Server Host Default: 127.0.0.1]
- PORT=5000 [Port number]
- POSTGRES_PORT=5432 [Database Port Number]
- POSTGRES_DB=store_dev [Default Database]
- POSTGRES_DB_TEST=store_test [Test Database]
- POSTGRES_USER=postgres [Database Default User]
- POSTGRES_PASSWORD=postgres [Database Default Password]
- SECRET_KEY=secretKey [Secret Key For Hashing]
- SALT_ROUNDS=10 [SALT ROUNDS For Hashing]
- TOKEN_SECRET=secretToken [Secret Token For Authentication and Authorization]
