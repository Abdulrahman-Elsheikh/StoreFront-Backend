import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import errorMiddleware from './middlewares/error.middleware';
import config from './middlewares/config';
import db from './database/database';

const app: express.Application = express();
const PORT = config.port || 3000;
const address = `0.0.0.0:${PORT}`;

app.use(bodyParser.json());
app.use(express.json());

app.get('/', function (_req: Request, res: Response) {
  res.send('Hello World!');
});

db.connect().then((client) => {
  return client
    .query('SELECT NOW()')
    .then((res) => {
      client.release();
      console.log(res.rows);
    })
    .catch((err) => {
      client.release();
      console.log(err.stack);
    });
});

app.use(errorMiddleware);

app.listen(PORT, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
