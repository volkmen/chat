import { connectToDatabase } from './services/typeorm';
import { parse } from 'graphql/index';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import Server from './server';

let server;
let dbConnection;
// let signedInExecutor;
// let signedOutExecutor;
const defaultUser = {
  email: 'email.gmail.com',
  username: 'John',
  password: 'Qwerty123!'
};

beforeAll(async () => {
  dbConnection = await connectToDatabase({
    database: 'test',
    dropSchema: true,
    synchronize: true
  });

  server = new Server();
  await server.initServer();
  await server.listen(3300, dbConnection);

  global.signedOutExecutor = buildHTTPExecutor({
    fetch: server.yoga.fetch,
    endpoint: `/graphiql`
  });

  const result = await global.signedOutExecutor({
    document: parse(/* GraphQL */ `
      mutation SignUp {
        SignUp(username: "${defaultUser.username}", email: "${defaultUser.email}", password: "${defaultUser.password}") {
            username
            is_verified
            jwtToken
            id
        }
      }
    `),
    operationName: 'SignUp'
  });

  global.defaultUserExecutor = buildHTTPExecutor({
    fetch: server.yoga.fetch,
    endpoint: `/graphiql`,
    headers: {
      Authorization: `Bearer ${result.data.SignUp.jwtToken}`
    }
  });

  global.dbConnection = dbConnection;
  global.defaultUser = defaultUser;
});

afterAll(async () => {
  // Ensure proper cleanup of the server (e.g., close server and DB connections)
  await server.close();
  await dbConnection.close();
});
