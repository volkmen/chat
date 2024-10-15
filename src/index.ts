import 'module-alias/register';

import App from './server';
import { connectToDatabase } from './services/typeorm';
import dataSourceConfig from './configs/typeorm-base.config';

const app = new App();
const isDevelopment = process.env.NODE_ENV === 'development';

const options = {
  ...dataSourceConfig,
  logging: isDevelopment,
  synchronize: isDevelopment
};

Promise.all([connectToDatabase(options), app.initServer()]).then(([dbConnection]) => {
  app.listen(4000, dbConnection);
});
