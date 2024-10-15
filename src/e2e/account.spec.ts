import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { parse } from 'graphql';
import App from '../server';
import { connectToDatabase } from '../services/typeorm';

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

    it('should add account', async () => {
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

    it('should remove account', async () => {
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
});
