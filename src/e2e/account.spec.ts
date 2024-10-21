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
const mockUser = {
  email: 'email.gmail.com',
  username: 'John',
  password: 'Qwerty123!'
};

function getExecutor(app, jwtToken?: string) {
  const addFields = jwtToken
    ? {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      }
    : {};

  return buildHTTPExecutor({
    fetch: app.yoga.fetch,
    endpoint: `/graphiql`,
    ...addFields
  });
}

describe('modules', () => {
  const app = new App();
  let dbConnection: any;
  let graph_builder: any;
  let executor: any;
  let jwtToken: string;

  beforeAll(async () => {
    dbConnection = await connectToDatabase({
      database: 'test',
      dropSchema: true,
      synchronize: true
    });

    await app.initServer();
    await app.listen(3300, dbConnection);
  });

  afterAll(async () => {
    // Ensure proper cleanup of the app (e.g., close server and DB connections)
    await app.close();
  });

  describe('account', () => {
    it('should SIGN UP', async () => {
      executor = getExecutor(app);

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
      jwtToken = result.data.SignUp.jwtToken;

      // const repository = app.dbConnection.getRepository(AccountEntity);
      // const id = result.data.SignUp.id;
      // const user = await repository.findOneBy({ id });
      // const token = user.emailToken;
    });

    it('should verify email', async () => {
      executor = getExecutor(app, jwtToken);
      const repository = app.dbConnection.getRepository(AccountEntity);
      const user = await repository.findOneBy({ id: 1 });
      const token = user.emailToken;
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

    it('Get accounts should exist', async () => {
      executor = getExecutor(app, jwtToken);
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
      expect(result.data.GetAccounts).toEqual([{ username: mockUser.username }]);
    });

    it('should update account', async () => {
      executor = getExecutor(app, jwtToken);

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

    it('should NOT signin into this account if wrong password', async () => {
      executor = getExecutor(app);
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

    it('should signin into this account if correct password', async () => {
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
      const executor = getExecutor(app, jwtToken);
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
    // it('Should be unverified once user created', async () => {
    //   const result = await executor({
    //     document: parse(/* GraphQL */ `
    //       mutation SignUp {
    //         SignUp(username: "yyyyy", password: "Qwerty123", email: "yyyyy@gmail.com") {
    //           is_verified
    //         }
    //       }
    //     `)
    //   });
    //   expect(result).toBeDefined();
    //   expect(result.data).toHaveProperty('SignUp');
    //   expect(result.data.SignUp.is_verified).toBeFalsy();
    // });
    //
    // it('Should be unverified once user created', async () => {
    //   const result = await executor({
    //     document: parse(/* GraphQL */ `
    //       mutation VerifyEmail {
    //         VerifyEmail(token: 1111) {
    //           is_verified
    //         }
    //       }
    //     `)
    //   });
    //   expect(result).toBeDefined();
    //   expect(result.data).toHaveProperty('SignUp');
    //   expect(result.data.SignUp.is_verified).toBeFalsy();
    // });
  });
});
