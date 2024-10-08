import App from './services/graphql-server';
import { connectToDatabase } from './services/typeorm';
import { DataSource } from 'typeorm';

const app = new App();

connectToDatabase().then(dataSource => {
  app.listen<DataSource>(4000, dataSource);
});
