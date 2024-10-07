import express, { type Request, type Response } from 'express';
import { initConnection } from './services/mongo-db';

const app = express();

app.use(express.json());

initConnection().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });
});
