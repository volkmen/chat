import {
  addChatExecution,
  getChatsExecution,
  getExecutor,
  makeSignUpExecution,
  signUpAddChat
} from './queryExecutions';
import { parse } from 'graphql/index';
import { SyncExecutor } from '@graphql-tools/utils/typings';
import { HTTPExecutorOptions } from '@graphql-tools/executor-http';
import { CHAT_ADDED, CHAT_IS_TYPING } from 'resolvers/chats/events';

describe('chats', () => {
  let executor: SyncExecutor<any, HTTPExecutorOptions>;
  let pubsub;

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

  it('should not add chat if receiver does not exists', async () => {
    const createChatResult = await addChatExecution(10);

    expect(createChatResult.errors.length).toBe(1);
  });

  it('should add chat if receiver', async () => {
    const result = await makeSignUpExecution();
    expect(result.data).toBeTruthy();

    const receiverId = result.data.SignUp.id;
    const createChatResult = await addChatExecution(receiverId);
    const createChatResultError = await addChatExecution(receiverId);

    expect(createChatResult.data).toBeTruthy();
    expect(createChatResultError.errors.length > 0).toBeTruthy();

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

  it('should return all user chats', async () => {
    const chatsBefore = await getChatsExecution();

    const lenChats = chatsBefore.data.GetChats.length;

    const result1 = await makeSignUpExecution();
    expect(result1.data).toBeTruthy();

    const receiverId1 = result1.data.SignUp.id;
    await addChatExecution(receiverId1);

    const result2 = await makeSignUpExecution();
    expect(result2.data).toBeTruthy();

    const receiverId2 = result2.data.SignUp.id;
    await addChatExecution(receiverId2);

    const result3 = await makeSignUpExecution();
    expect(result3.data).toBeTruthy();

    const receiverId3 = result3.data.SignUp.id;
    await addChatExecution(receiverId3);

    const chatsAfter = await getChatsExecution();

    expect(chatsAfter.data.GetChats.length >= 3 + lenChats).toBe(true);
  });

  it('should return user chat by id', async () => {
    const result = await makeSignUpExecution();
    expect(result.data).toBeTruthy();

    const receiverId = result.data.SignUp.id;

    const resultAddChat = await addChatExecution(receiverId);

    const chatId = resultAddChat.data.AddChat;

    const chat = await executor({
      document: parse(/* GraphQL */ `
        query GetChat {
          GetChat(id: ${chatId}) {
            id
            correspondent {
              id
              username
            }
          }
        }
      `)
    });

    expect(chat.data.GetChat.correspondent).toBeTruthy();

    const receiverExecutor = getExecutor(result.data.SignUp.jwtToken);
    const addChatException = await addChatExecution(1, receiverExecutor);

    expect(addChatException.errors.length).toBe(1);
  });

  it('should subscription to be invoked once chat is added', async () => {
    const { chatId, receiverId } = await signUpAddChat();

    expect(pubsub.publish).toHaveBeenCalledWith(`${CHAT_ADDED}_${receiverId}`, { chatId, receiverId });
  });

  it('should publish IS_TYPING once chat is added', async () => {
    const { chatId } = await signUpAddChat();
    pubsub.publish.mockReset();

    const doTypingResult = await executor({
      document: parse(/* GraphQL */ `
        query DoTyping {
          DoTyping(chatId: ${chatId}, isTyping: true)
        }
      `)
    });

    expect(doTypingResult.data.DoTyping).toBe(true);
    expect(pubsub.publish).toHaveBeenCalledWith(
      `${CHAT_IS_TYPING}_${chatId}`,
      expect.objectContaining({ isTyping: true })
    );
  });

  it('should NOT publish IS_TYPING to be invoked once chat is added if chatId is wrong', async () => {
    await signUpAddChat();
    pubsub.publish.mockReset();

    const doTypingResult = await executor({
      document: parse(/* GraphQL */ `
        query DoTyping {
          DoTyping(chatId: 100, isTyping: true) {
            ... on MessageIsTyping {
              username
              isTyping
            }
          }
        }
      `)
    });

    expect(doTypingResult.errors).toBeTruthy();
    expect(pubsub.publish).toHaveBeenCalledTimes(0);
  });
});
