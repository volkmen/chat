import {
  addChatExecution,
  addMessageExecution,
  getExecutor,
  getMessageExecution,
  getMessagesExecution,
  makeSignUpExecution,
  signUpAddChat
} from './queryExecutions';
import { parse } from 'graphql/index';
import { SyncExecutor } from '@graphql-tools/utils/typings';
import { HTTPExecutorOptions } from '@graphql-tools/executor-http';

describe('chat', () => {
  let pubsub;
  let executor: SyncExecutor<any, HTTPExecutorOptions>;

  beforeAll(() => {
    executor = globalThis.defaultUserExecutor;
    pubsub = globalThis.server.context.pubsub;
  });

  beforeEach(() => {
    jest.spyOn(pubsub, 'publish');
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  it('should update isRead message', async () => {
    const { chatId, jwtToken } = await signUpAddChat();
    const result = await addMessageExecution({ chatId, content: 'new message' });

    expect(result.data.AddMessage).toBeTruthy();
    const msgId = result.data.AddMessage.id;
    const msgResult = await getMessageExecution(msgId);
    expect(msgResult.data.GetMessage.isRead).toBeFalsy();
    const executorReceiver = getExecutor(jwtToken);

    const doTypingResult = await executorReceiver({
      document: parse(/* GraphQL */ `
        mutation ReadMessage {
          ReadMessage(id: ${msgId}) 
        }
      `)
    });

    expect(doTypingResult.data.ReadMessage).toBe(msgId);
  });

  it('pagination for messages. Should return messages paginated', async () => {
    const { chatId } = await signUpAddChat();
    const pageSize = 3;
    const totalMesgs = 5;
    const { data, total, page, size } = await getMessagesExecution({ chatId, page: 1, size: pageSize });
    expect(data).toBeTruthy();
    expect(total).toBe(0);
    expect(page).toBe(1);
    expect(size).toBe(pageSize);

    await Promise.all(
      Array.from(new Array(totalMesgs)).map((_, i) => {
        return addMessageExecution({ chatId, content: `I am message number - ${i}` });
      })
    );

    const resultPage1 = await getMessagesExecution({ chatId, page: 1, size: pageSize });
    expect(resultPage1.data.length).toBe(pageSize);

    const resultPage2 = await getMessagesExecution({ chatId, page: 2, size: pageSize });
    expect(resultPage2.data.length).toBe(totalMesgs - pageSize);
  });
});
