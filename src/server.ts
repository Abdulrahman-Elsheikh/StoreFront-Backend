import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import errorMiddleware from './middlewares/error.middleware';
import config from './middlewares/config';
import routes from './routes/index';

const app: express.Application = express();
const PORT = config.port || 3000;
const address = `0.0.0.0:${PORT}`;

app.use(bodyParser.json());
app.use(express.json());

app.use('/api', routes);

app.get('/', function (_req: Request, res: Response) {
  res.send('Welcome To Our Store');
});

app.use(errorMiddleware);

app.listen(PORT, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
