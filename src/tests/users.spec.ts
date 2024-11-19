import { parse } from 'graphql';

describe('USERS', () => {
  let executor;

  beforeEach(() => {
    executor = global.defaultUserExecutor;
  });

  it('Get me', async () => {
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
    expect(result.data.GetMe.username).toBeTruthy();
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
    expect(result.data.GetUsers.length > 0).toBeTruthy();
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
