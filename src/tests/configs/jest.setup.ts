import { connectToDatabase } from '../../services/typeorm';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import Server from '../../server';
import nodemailer from 'nodemailer';

jest.spyOn<any, any>(nodemailer, 'createTransport').mockImplementation(() => {
  return {
    sendMail: jest.fn().mockResolvedValue(true)
  };
});

let server;
let dbConnection;
// let signedInExecutor;
// let signedOutExecutor;
jest.spyOn<any, any>(nodemailer, 'createTransport').mockImplementation(() => {
  return {
    sendMail: jest.fn().mockResolvedValue(null)
  };
});

beforeAll(async () => {
  if (global.started) {
    return;
  }

  global.started = true;
  dbConnection = await connectToDatabase({
    database: 'test'
  });

  server = new Server();
  await server.initServer();
  await server.listen(3300, dbConnection);

  global.signedOutExecutor = buildHTTPExecutor({
    fetch: server.yoga.fetch,
    endpoint: `/graphiql`
  });

  const jwtToken = server.jwtService.createToken({ id: 1 });

  global.defaultUserExecutor = buildHTTPExecutor({
    fetch: server.yoga.fetch,
    endpoint: `/graphiql`,
    headers: {
      Authorization: `Bearer ${jwtToken}`
    }
  });

  global.dbConnection = dbConnection;
});

afterAll(async () => {
  // Ensure proper cleanup of the server (e.g., close server and DB connections)
  await server.close();
  await dbConnection.close();
});
