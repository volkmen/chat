import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { parse } from 'graphql';
import App from '../server';
import { connectToDatabase } from '../services/typeorm';
import nodemailer from 'nodemailer';

jest.spyOn(nodemailer, 'createTransport').mockImplementation(() => {
  return {
    sendMail: jest.fn().mockResolvedValue(true)
  };
});

describe('modules', () => {
  let app: App;
  let dbConnection: any;
  let executor: any;

  beforeAll(async () => {
    app = new App();
    dbConnection = await connectToDatabase({
      database: 'test',
      dropSchema: true,
      synchronize: true
    });

    await app.initServer();
    executor = buildHTTPExecutor({
      fetch: app.yoga.fetch,
      endpoint: `/graphiql`
    });

    await app.listen(3300, dbConnection);
  });

  afterAll(async () => {
    // Ensure proper cleanup of the app (e.g., close server and DB connections)
    await app.close();
  });

  describe('account', () => {
    it('Get accounts should exist', async () => {
      const result = await executor({
        document: parse(/* GraphQL */ `
          query GetAccounts {
            GetAccounts {
              username
            }
          }
        `)
      });

      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('GetAccounts');
      expect(result.data.GetAccounts).toEqual([]);
    });

    it.only('should add account', async () => {
      const result = await executor({
        document: parse(/* GraphQL */ `
          mutation AddAccount {
            AddAccount(username: "volkman", email: "volkman@gmail.com", password: "Password") {
              username
            }
          }
        `)
      });

      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('AddAccount');
      expect(result.data.AddAccount).toEqual({ username: 'volkman' });
    });

    it('should update account', async () => {
      const result = await executor({
        document: parse(/* GraphQL */ `
          mutation UpdateAccount {
            UpdateAccount(id: 1, username: "yar") {
              username
            }
          }
        `)
      });
      console.log(result);
      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('UpdateAccount');
      expect(result.data.UpdateAccount).toEqual({ username: 'yar' });
    });

    it.skip('should remove account', async () => {
      const result = await executor({
        document: parse(/* GraphQL */ `
          mutation DeleteAccount {
            DeleteAccount(id: 1)
          }
        `)
      });
      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('DeleteAccount');
      expect(result.data.DeleteAccount).toBe('1');
    });
  });
  describe.skip('account verification', () => {
    it('Should be unverified once user created', async () => {
      const result = await executor({
        document: parse(/* GraphQL */ `
          mutation AddAccount {
            AddAccount(username: "yyyyy", password: "Qwerty123", email: "yyyyy@gmail.com") {
              is_verified
            }
          }
        `)
      });
      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('AddAccount');
      expect(result.data.AddAccount.is_verified).toBeFalsy();
    });

    it('Should be unverified once user created', async () => {
      const result = await executor({
        document: parse(/* GraphQL */ `
          mutation VerifyEmail {
            VerifyEmail(token: 1111) {
              is_verified
            }
          }
        `)
      });
      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('AddAccount');
      expect(result.data.AddAccount.is_verified).toBeFalsy();
    });
  });
});
