import { parse } from 'graphql';
import nodemailer from 'nodemailer';
import { UserEntity } from '../entities/User.entity';
import { faker } from '@faker-js/faker';

jest.spyOn<any, any>(nodemailer, 'createTransport').mockImplementation(() => {
  return {
    sendMail: jest.fn().mockResolvedValue(true)
  };
});

const mockUser = {
  username: faker.internet.username(), // before version 9.1.0, use userName()
  email: faker.internet.email(),
  password: faker.internet.password()
};
let executor;

describe('AUTH apis', () => {
  beforeAll(() => {
    executor = globalThis.defaultUserExecutor;
  });

  it('should SIGN UP', async () => {
    const result = await globalThis.signedOutExecutor({
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
  });

  it('should resend verification token', async () => {
    const repository = globalThis.dbConnection.getRepository(UserEntity);
    const user = await repository.findOneBy({ id: 1 });
    const token = user.email_token;

    const resultVerifyEmail = await executor({
      document: parse(/* GraphQL */ `
        query ResendVerificationToken {
          ResendVerificationToken
        }
      `)
    });

    const userUpdated = await repository.findOneBy({ id: 1 });
    expect(token).not.toEqual(userUpdated.email_token);
    expect(resultVerifyEmail.data.ResendVerificationToken).toBeTruthy();
  });

  it('should verify email', async () => {
    const repository = globalThis.dbConnection.getRepository(UserEntity);
    const user = await repository.findOneBy({ id: 1 });
    const token = user.email_token;

    const resultVerifyEmail = await executor({
      document: parse(/* GraphQL */ `
          mutation VerifyEmail {
            VerifyEmail(token: ${token}) {
              is_verified
              id
            }
          }
        `)
    });

    expect(resultVerifyEmail.data.VerifyEmail).toBeTruthy();
    expect(resultVerifyEmail.data.VerifyEmail.is_verified).toBeTruthy();
  });

  it('should NOT signin into this auth if wrong password', async () => {
    const result = await globalThis.signedOutExecutor({
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

  it('should signin into this auth if correct password', async () => {
    const result = await globalThis.signedOutExecutor({
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
});
