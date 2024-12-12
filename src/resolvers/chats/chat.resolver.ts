import { createAuthResolver, getQueryFieldsMapFromGraphQLRequestedInfo } from 'utils/resolvers';
import { Context } from 'types/server';
import { getDataSourceAndUserId, getUserIdFromContext } from 'utils/context';
import { CHAT_ADDED, CHAT_IS_TYPING } from './events';
import { ForbiddenError } from 'utils/errors';

const resolver = {
  Query: {
    GetChats: createAuthResolver((_, args, context: Context) => {
      const { dataSource, userId } = getDataSourceAndUserId(context, 'chats');
      return dataSource.getChats(userId);
    }),
    GetChat: createAuthResolver<{ id: number }>((_, args, context: Context, info) => {
      const { dataSource, userId } = getDataSourceAndUserId(context, 'chats');
      const fieldsMap = getQueryFieldsMapFromGraphQLRequestedInfo(info);
      return dataSource.getChatById(userId, { chatId: args.id }, fieldsMap);
    }),
    DoTyping: createAuthResolver<{ chatId: number; isTyping: boolean }>(
      async (_, { chatId, isTyping }, context: Context) => {
        const { userId, dataSource } = getDataSourceAndUserId(context, 'chats');
        const chat = await dataSource.selectChatIdWithUsername(userId, { chatId: chatId });

        if (chat) {
          context.pubsub.publish(`${CHAT_IS_TYPING}_${chatId}`, { isTyping, username: chat.username });
          return { isTyping, username: chat.username };
        }
        throw new ForbiddenError('Not allowed');
      }
    )
  },
  Mutation: {
    AddChat: createAuthResolver<{ receiverId: number }>(async (_, args, context: Context) => {
      const { dataSource, userId } = getDataSourceAndUserId<'chats'>(context, 'chats');
      const chatId = await dataSource.addChat(userId, args);
      context.pubsub.publish(`${CHAT_ADDED}_${args.receiverId}`, { receiverId: args.receiverId, chatId });
      return chatId;
    })
  },
  Subscription: {
    OnChatAdded: {
      subscribe: createAuthResolver((_, args, context: Context) => {
        const userId = getUserIdFromContext(context);
        return context.pubsub.subscribe(`${CHAT_ADDED}_${userId}`);
      }),
      resolve: payload => {
        return payload.chatId;
      }
    },
    OnTyping: {
      subscribe: createAuthResolver<{ chatId: number }>(async (_, args, context: Context) => {
        const { userId, dataSource } = getDataSourceAndUserId(context, 'chats');
        const chat = await dataSource.selectChatIdWithUsername(userId, { chatId: args.chatId });
        if (chat) {
          return context.pubsub.subscribe(`${CHAT_IS_TYPING}_${args.chatId}`);
        }
      }),
      resolve: payload => payload
    }
  }
};

export default resolver;
