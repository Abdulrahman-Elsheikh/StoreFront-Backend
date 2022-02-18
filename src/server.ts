import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import errorMiddleware from './middlewares/error.middleware';

const app: express.Application = express();
const address = '0.0.0.0:3000';

app.use(bodyParser.json());
app.use(express.json());

app.get('/', function (_req: Request, res: Response) {
  throw new Error();
  res.send('Hello World!');
});

app.use(errorMiddleware);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
