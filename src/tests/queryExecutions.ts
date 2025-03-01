import { parse } from 'graphql/index';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { faker } from '@faker-js/faker';
import { SyncExecutor } from '@graphql-tools/utils';
import { HTTPExecutorOptions } from '@graphql-tools/executor-http/typings';
import { Paginated } from '../types/pagination';
import { MessageEntity } from '../entities/Message.entity';
import { MessageUpload } from '../types/messages';

export function getChatsExecution(executor = globalThis.defaultUserExecutor) {
  return executor({
    document: parse(/* GraphQL */ `
      query GetChats {
        GetChats {
          id
          correspondent {
            id
            username
          }
        }
      }
    `)
  });
}

export function addChatExecution(
  receiverId: number,
  executor: SyncExecutor<any, HTTPExecutorOptions> = globalThis.defaultUserExecutor
) {
  return executor({
    document: parse(/* GraphQL */ `
        mutation AddChat {
            AddChat(receiverId: "${receiverId}")
        }
    `)
  });
}

export function makeSignUpExecution(
  args = { username: faker.internet.username(), password: faker.internet.password(), email: faker.internet.email() }
): any {
  return globalThis.signedOutExecutor({
    document: parse(/* GraphQL */ `
      mutation SignUp {
        SignUp(username: "${args.username}", email: "${args.email}", password: "${args.password}") {
          username
          is_verified
          jwtToken
          id
        }
      }
    `),
    operationName: 'SignUp'
  });
}

export function getExecutor(jwtToken) {
  return buildHTTPExecutor({
    fetch: globalThis.server.yoga.fetch,
    endpoint: `/graphql`,
    headers: {
      Authorization: `Bearer ${jwtToken}`
    }
  });
}

export function addMessageExecution(
  { content, chatId, uploads = [] }: { content: string; chatId: number; uploads?: MessageUpload[] },
  executor = globalThis.defaultUserExecutor
) {
  return executor({
    document: parse(/* GraphQL */ `
      mutation AddMessage($chatId: ID!, $content: String!, $uploads: [MessageUpload]) {
        AddMessage(chatId: $chatId, content: $content, uploads: $uploads) {
          id
        }
      }
    `),
    variables: {
      chatId,
      content,
      uploads
    }
  });
}

export async function addChatAndMessage(content: string, uploads?: MessageUpload[]) {
  const result = await makeSignUpExecution();
  expect(result.data).toBeTruthy();

  const receiverId = result.data.SignUp.id;
  const resultAddChat = await addChatExecution(receiverId);

  const chatId: number = +resultAddChat.data.AddChat;

  const addMessageResult = await addMessageExecution({ chatId, content, uploads });
  return { addMessageResult, chatId };
}

export function getMessageExecution(messageId: number, executor = globalThis.defaultUserExecutor) {
  return executor({
    document: parse(/* GraphQL */ `
      query GetMessage($messageId: ID!) {
        GetMessage(messageId: $messageId) {
          id
          isRead
        }
      }
    `),
    variables: {
      messageId
    }
  });
}
export async function signUpAddChat() {
  const result = await makeSignUpExecution();
  const receiverId = result.data.SignUp.id;
  const jwtToken = result.data.SignUp.jwtToken;
  const createChatResult = await addChatExecution(receiverId);
  const chatId = +createChatResult.data.AddChat;
  const executor = getExecutor(jwtToken);

  return { chatId, receiverId, jwtToken, executor };
}

export async function getMessagesExecution(
  { chatId, page, size }: { chatId: number; page: number; size: number },
  executor = globalThis.defaultUserExecutor
): Promise<Paginated<MessageEntity>> {
  const result: { data: { GetMessages: Paginated<MessageEntity> } } = await executor({
    document: parse(/* GraphQL */ `
      query GetMessages($chatId: ID!, $page: Int, $size: Int) {
        GetMessages(chatId: $chatId, page: $page, size: $size) {
          page
          size
          total
          data {
            id
            owner {
              id
            }
            uploads {
              id
              url
            }
          }
        }
      }
    `),
    variables: {
      page,
      chatId,
      size
    }
  });

  return result.data.GetMessages;
}
