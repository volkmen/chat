import './moduleAliases';
import App from './server';
import { connectToDatabase } from './services/typeorm';
import { DataSource } from 'typeorm';

const app = new App();

Promise.all([
  connectToDatabase({
    migrationsRun: true,
    logging: true
  }),
  app.initServer()
]).then(([dbDataSource]) => {
  app.initContext(dbDataSource as DataSource);
  app.listen(4000);
});
