import { createAuthResolver, getQueryFieldsMapFromGraphQLRequestedInfo } from 'utils/resolvers';
import { Context } from 'types/server';
import { getDataSourceAndUserId, getUserIdFromContext } from 'utils/context';
import { CHAT_ADDED } from './events';

const resolver = {
  Query: {
    GetChats: createAuthResolver((_, args, context: Context) => {
      const { dataSource, userId } = getDataSourceAndUserId(context, 'chats');
      return dataSource.getChats(userId);
    }),
    GetChat: createAuthResolver<{ id: number }>((_, args, context: Context, info) => {
      const { dataSource, userId } = getDataSourceAndUserId(context, 'chats');
      const fieldsMap = getQueryFieldsMapFromGraphQLRequestedInfo(info);
      return dataSource.getChatById({ userId, chatId: args.id }, fieldsMap);
    })
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
    ChatAdded: {
      subscribe: createAuthResolver((_, args, context: Context) => {
        const userId = getUserIdFromContext(context);
        return context.pubsub.subscribe(`${CHAT_ADDED}_${userId}`);
      }),
      resolve: payload => {
        return payload.chatId;
      }
    }
  }
};

export default resolver;
