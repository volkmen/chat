import { addChatExecution, makeSignUpExecution } from './queryExecutions';
import { parse } from 'graphql/index';

describe('chat', () => {
  let executor: any;

  beforeAll(() => {
    executor = globalThis.defaultUserExecutor;
  });

  it('should not add chat if receiver does not exists', async () => {
    const createChatResult = await addChatExecution(10);

    expect(createChatResult.errors.length).toBe(1);
  });

  it('should add chat if receiver', async () => {
    const result = await makeSignUpExecution();
    expect(result.data).toBeTruthy();

    const receiverId = result.data.SignUp.id;
    const createChatResult = await addChatExecution(receiverId);

    expect(createChatResult.data).toBeTruthy();

    const usersResult = await executor({
      document: parse(/* GraphQL */ `
        query GetUser {
          GetMe {
            username
            email
            chats {
              id
            }
          }
        }
      `)
    });

    expect(usersResult.data.GetMe).toBeTruthy();
    expect(usersResult.data.GetMe.chats.length).toBeTruthy();
  });
});
