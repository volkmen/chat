import { parse } from 'graphql';
import nodemailer from 'nodemailer';

jest.spyOn<any, any>(nodemailer, 'createTransport').mockImplementation(() => {
  return {
    sendMail: jest.fn().mockResolvedValue(true)
  };
});

describe('USERS', () => {
  let executor;

  beforeEach(() => {
    executor = global.defaultUserExecutor;
  });

  it('Get me', async () => {
    const executor = global.defaultUserExecutor;

    const result = await executor({
      document: parse(/* GraphQL */ `
        query GetMe {
          GetMe {
            username
          }
        }
      `)
    });

    expect(result).toBeDefined();
    expect(result.data).toHaveProperty('GetMe');
    expect(result.data.GetMe.username).toBe(global.defaultUser.username);
  });

  it('Get users should exist', async () => {
    const result = await executor({
      document: parse(/* GraphQL */ `
        query GetUsers {
          GetUsers {
            username
          }
        }
      `)
    });

    expect(result).toBeDefined();
    expect(result.data).toHaveProperty('GetUsers');
    expect(result.data.GetUsers).toEqual([{ username: global.defaultUser.username }]);
  });

  it('should update me', async () => {
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
});
