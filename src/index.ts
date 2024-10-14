import 'module-alias/register';

import App from './services/graphql-server';
import { connectToDatabase } from './services/typeorm';

const app = new App();

connectToDatabase().then(dbConnection => {
  app.listen(4000, dbConnection);
});
