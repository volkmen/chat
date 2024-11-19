import { connectToDatabase } from '../../services/typeorm';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import Server from '../../server';
import nodemailer from 'nodemailer';

jest.spyOn<any, any>(nodemailer, 'createTransport').mockImplementation(() => {
  return {
    sendMail: jest.fn().mockResolvedValue(true)
  };
});

let dbConnection;
// let signedInExecutor;
// let signedOutExecutor;
jest.spyOn<any, any>(nodemailer, 'createTransport').mockImplementation(() => {
  return {
    sendMail: jest.fn().mockResolvedValue(null)
  };
});

beforeAll(async () => {
  dbConnection = await connectToDatabase({
    database: 'test'
  });

  const server = new Server();
  await server.initServer();
  await server.initContext(dbConnection);

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
  await dbConnection.close();
});
