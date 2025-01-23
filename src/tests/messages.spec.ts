import {
  addChatAndMessage,
  addMessageExecution,
  getExecutor,
  getMessageExecution,
  getMessagesExecution,
  signUpAddChat
} from './queryExecutions';
import { parse } from 'graphql/index';
import { SyncExecutor } from '@graphql-tools/utils/typings';
import { HTTPExecutorOptions } from '@graphql-tools/executor-http';

describe('messages', () => {
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
    const { addMessageResult } = await addChatAndMessage('I am message here');
    expect(addMessageResult.data.AddMessage).toBeTruthy();
  });

  it('delete message', async () => {
    const { addMessageResult } = await addChatAndMessage('I am message here');
    expect(addMessageResult.data.AddMessage).toBeTruthy();

    const msgId = addMessageResult.data.AddMessage.id;

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

    const readMsgResult = await executorReceiver({
      document: parse(/* GraphQL */ `
        mutation ReadMessage {
          ReadMessage(id: ${msgId}) 
        }
      `)
    });

    expect(readMsgResult.data.ReadMessage).toBe(msgId);
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

describe('upload message', () => {
  let executor: SyncExecutor<any, HTTPExecutorOptions>;

  beforeAll(() => {
    executor = globalThis.defaultUserExecutor;
  });

  it('should return signedUrl', async () => {
    const result = await executor({
      document: parse(/* GraphQL */ `
        query GetS3PutObjectUrl {
          GetS3PutObjectUrl(type: "image")
        }
      `)
    });

    expect(result.data.GetS3PutObjectUrl).toBeTruthy();
  });

  it('should add upload into database', async () => {
    const result = await executor({
      document: parse(/* GraphQL */ `
        query GetS3PutObjectUrl {
          GetS3PutObjectUrl(type: "image")
        }
      `)
    });

    const url = result.data.GetS3PutObjectUrl.split('?')[0];
    const uploads = [
      {
        url,
        fileName: 'test',
        contentType: 'image',
        size: 1024
      }
    ];

    await addChatAndMessage('I am message here', uploads);
    const val = await globalThis.dbConnection.query(
      `SELECT * FROM "MessageUploads" ORDER BY "created_at" DESC LIMIT 1`
    );
    expect(val[0].url).toBe(url);
  });

  it('should return messages with uploads', async () => {
    const uploads = [
      {
        url: 'some-url',
        fileName: 'test',
        contentType: 'image',
        size: 1024
      }
    ];

    const { chatId } = await addChatAndMessage('I am message here', uploads);

    const resultPage1 = await getMessagesExecution({ chatId, page: 1, size: 10 });
    expect(resultPage1.data).toBeTruthy();
    expect(resultPage1.data[0].uploads.length > 0).toBe(true);
  });
});
