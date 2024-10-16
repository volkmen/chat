import 'module-alias/register';

import App from './server';
import { connectToDatabase } from './services/typeorm';

const app = new App();

Promise.all([connectToDatabase({ dropSchema: true }), app.initServer()]).then(([dbConnection]) => {
  app.listen(4000, dbConnection);
});
