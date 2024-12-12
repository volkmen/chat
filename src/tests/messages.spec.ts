import { addChatExecution, addMessageExecution, makeSignUpExecution } from './queryExecutions';
import { parse } from 'graphql/index';
import { SyncExecutor } from '@graphql-tools/utils/typings';
import { HTTPExecutorOptions } from '@graphql-tools/executor-http';

describe('chat', () => {
  let executor: SyncExecutor<any, HTTPExecutorOptions>;

  beforeAll(() => {
    executor = globalThis.defaultUserExecutor;
  });

  it('add message', async () => {
    const result = await makeSignUpExecution();
    expect(result.data).toBeTruthy();

    const receiverId = result.data.SignUp.id;
    const resultAddChat = await addChatExecution(receiverId);

    const chatId: number = +resultAddChat.data.AddChat;

    const addMessage = await addMessageExecution({ chatId, content: 'I am message here' });
    expect(addMessage.data.AddMessage).toBeTruthy();
  });

  it('delete message', async () => {
    const result = await makeSignUpExecution();
    expect(result.data).toBeTruthy();

    const receiverId = result.data.SignUp.id;
    const resultAddChat = await addChatExecution(receiverId);

    const chatId: number = +resultAddChat.data.AddChat;

    const addMessage = await addMessageExecution({ chatId, content: 'I am message here' });
    expect(addMessage.data.AddMessage).toBeTruthy();

    const msgId = addMessage.data.AddMessage.id;

    const delMsgResult = await globalThis.defaultUserExecutor({
      document: parse(/* GraphQL */ `
          mutation DeleteMessage {
              DeleteMessage(id: ${msgId})
          }
      `)
    });

    expect(delMsgResult.data.DeleteMessage).toBeTruthy();
  });
});
