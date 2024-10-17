import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { parse } from 'graphql';
import App from '../server';
import { connectToDatabase } from '../services/typeorm';
import nodemailer from 'nodemailer';
import { AccountEntity } from '../entities/Account.entity';

jest.spyOn(nodemailer, 'createTransport').mockImplementation(() => {
  return {
    sendMail: jest.fn().mockResolvedValue(true)
  };
});

describe('modules', () => {
  let app: App;
  let dbConnection: any;
  let executor: any;
  let graph_builder: any;

  const mockUser = {
    email: 'email.gmail.com',
    username: 'John',
    password: 'Qwerty123!'
  };

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

    it('should SIGN UP', async () => {
      const result = await executor({
        document: parse(/* GraphQL */ `
          mutation SignUp {
            SignUp(username: "${mockUser.username}", email: "${mockUser.email}", password: "${mockUser.password}") {
              username
              is_verified
              jwtToken
              id
            }
          }
        `),
        operationName: 'SignUp'
      });

      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('SignUp');
      expect(result.data.SignUp).toBeTruthy();

      expect(result.data.SignUp.is_verified).toBeFalsy();
      expect(result.data.SignUp.jwtToken).toBeTruthy();
      const jwtToken = result.data.SignUp.jwtToken;
      const repository = app.dbConnection.getRepository(AccountEntity);
      const id = result.data.SignUp.id;
      const user = await repository.findOneBy({ id });
      const token = user.emailToken;

      executor = buildHTTPExecutor({
        fetch: app.yoga.fetch,
        endpoint: `/graphiql`,
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      //
      const resultVerifyEmail = await executor({
        document: parse(/* GraphQL */ `
          mutation VerifyEmail {
            VerifyEmail(token: "${token}") {
              is_verified
              id
            }
          }
        `)
      });

      expect(resultVerifyEmail.data.VerifyEmail).toBeTruthy();
      expect(resultVerifyEmail.data.VerifyEmail.is_verified).toBeTruthy();
    });

    it('should update account', async () => {
      const result = await executor({
        document: parse(/* GraphQL */ `
          mutation UpdateMe {
            UpdateMe(username: "yar") {
              username
            }
          }
        `)
      });
      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('UpdateMe');
      expect(result.data.UpdateMe).toEqual({ username: 'yar' });
    });

    it('should NOT signin into this account', async () => {
      const result = await executor({
        document: parse(/* GraphQL */ `
          mutation SignIn {
            SignIn(email: "${mockUser.email}", password: "wrong password") {
              email
            }
          }
        `)
      });
      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('SignIn');
      expect(result.data.SignIn).toBeFalsy();
    });

    it('should signin into this account', async () => {
      const result = await executor({
        document: parse(/* GraphQL */ `
          mutation SignIn {
            SignIn(email: "${mockUser.email}", password: "${mockUser.password}") {
              email
            }
          }
        `)
      });
      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('SignIn');
      expect(result.data.SignIn).toBeTruthy();
    });

    it('should remove account', async () => {
      const result = await executor({
        document: parse(/* GraphQL */ `
          mutation DeleteMe {
            DeleteMe
          }
        `)
      });
      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('DeleteMe');
      expect(result.data.DeleteMe).toBe('1');
    });
  });

  describe.skip('account verification', () => {
    it('Should be unverified once user created', async () => {
      const result = await executor({
        document: parse(/* GraphQL */ `
          mutation SignUp {
            SignUp(username: "yyyyy", password: "Qwerty123", email: "yyyyy@gmail.com") {
              is_verified
            }
          }
        `)
      });
      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('SignUp');
      expect(result.data.SignUp.is_verified).toBeFalsy();
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
      expect(result.data).toHaveProperty('SignUp');
      expect(result.data.SignUp.is_verified).toBeFalsy();
    });
  });
});
