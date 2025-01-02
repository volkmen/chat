import './moduleAliases';
import dotenv from 'dotenv';
import { getEnvVariablesPath, getIsDevelopment } from './utils/env';
dotenv.config({ path: getEnvVariablesPath() });

import App from './server';
import { connectToDatabase } from './services/typeorm';
import { DataSource } from 'typeorm';

const app = new App();

Promise.all([
  connectToDatabase({
    migrationsRun: true,
    logging: getIsDevelopment(),
    cache: {
      type: 'redis',
      options: {
        socket: {
          host: `${process.env.REDIS_HOST}`,
          port: `${process.env.REDIS_PORT}`
        }
      }
    }
  }),
  app.initServer()
]).then(([dbDataSource]) => {
  app.initContext(dbDataSource as DataSource);
  app.listen(4000);
});
