import { initConnection } from './services/mongo-db';
import App from './server';

const app = new App();

initConnection().then(async () => {
  app.listen(4000);
});
