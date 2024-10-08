import { initConnection } from './services/mongo-db';
import App from './server';

const app = new App();

initConnection().then(async connection => {
  app.listen(4000, connection);
});
