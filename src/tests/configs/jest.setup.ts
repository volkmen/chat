import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), `src/envs/testing.env`) });

import nodemailer from 'nodemailer';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { connectToDatabase } from '../../services/typeorm';
import Server from '../../server';
import { ONE_MINUTE } from '../../utils/date';

jest.spyOn<any, any>(nodemailer, 'createTransport').mockImplementation(() => {
  return {
    sendMail: jest.fn().mockResolvedValue(true)
  };
});
//
// jest.mock('@aws-sdk/s3-request-presigner', () => ({
//   getSignedUrl: jest.fn().mockResolvedValue('some-url')
// }));

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
    database: 'test',
    synchronize: true,
    cache: {
      milliseconds: ONE_MINUTE
    }
  });

  const server = new Server();
  await server.initServer();
  await server.initContext(dbConnection);

  global.signedOutExecutor = buildHTTPExecutor({
    fetch: server.yoga.fetch,
    endpoint: `/graphql`
  });

  const jwtToken = server.jwtService.createToken({ id: 1 });

  global.defaultUserExecutor = buildHTTPExecutor({
    fetch: server.yoga.fetch,
    endpoint: `/graphql`,
    headers: {
      Authorization: `Bearer ${jwtToken}`
    }
  });

  global.dbConnection = dbConnection;
  global.server = server;
});

afterAll(async () => {
  // Ensure proper cleanup of the server (e.g., close server and DB connections)
  await dbConnection.close();
});
