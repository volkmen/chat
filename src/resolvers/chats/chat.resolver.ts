import { createAuthResolver, getQueryFieldsMapFromGraphQLRequestedInfo } from 'utils/resolvers';
import { Context } from 'types/server';
import { getUserIdFromContext } from 'utils/context';
import { ChatEvents } from 'consts/events';

const resolver = {
  Query: {
    GetChats: createAuthResolver((_, args, context: Context) => {
      const {
        dataSources: { chats: chatsDataSource }
      } = context;
      const userId = getUserIdFromContext(context);

      return chatsDataSource.getChats(userId);
    }),
    GetChat: createAuthResolver<{ id: number }>((_, args, context: Context, info) => {
      const {
        dataSources: { chats: chatsDataSource }
      } = context;
      const userId = getUserIdFromContext(context);
      const fieldsMap = getQueryFieldsMapFromGraphQLRequestedInfo(info);

      return chatsDataSource.getChatById({ userId, chatId: +args.id }, fieldsMap);
    }),
    GetMessages: createAuthResolver<{ chatId: number }>((_, args, context: Context) => {
      const {
        dataSources: { chats: chatsDataSource }
      } = context;
      const userId = getUserIdFromContext(context);
      return chatsDataSource.getMessages(userId, args.chatId);
    })
  },
  Mutation: {
    AddChat: createAuthResolver<{ receiverId: number }>((_, args, context: Context) => {
      const {
        dataSources: { chats: chatsDataSource }
      } = context;
      const userId = getUserIdFromContext(context);
      return chatsDataSource.addChat(userId, args);
    }),
    AddMessage: createAuthResolver<{ content: string; chatId: number }>(async (_, args, context: Context) => {
      const {
        dataSources: { chats: chatsDataSource },
        pubsub
      } = context;
      const userId = getUserIdFromContext(context);

      const msg = await chatsDataSource.addMessage(userId, {
        chatId: args.chatId,
        content: args.content
      });
      pubsub.publish(`${ChatEvents.MESSAGE_WAS_ADDED}_${args.chatId}`, { msg });
      console.log('PUBLISH MESSAGE_RECEIVED', `${ChatEvents.MESSAGE_WAS_ADDED}_${args.chatId}`, msg);
      return msg;
    }),
    DeleteMessage: createAuthResolver<{ id: number }>((_, args, context: Context) => {
      const {
        dataSources: { chats: chatsDataSource }
      } = context;
      const userId = getUserIdFromContext(context);
      return chatsDataSource.deleteMessage(userId, args.id);
    })
  },
  Subscription: {
    MessageReceived: {
      subscribe: (_, args, { pubsub }) => {
        return pubsub.subscribe(`${ChatEvents.MESSAGE_WAS_ADDED}_${args.chatId}`);
      },
      resolve: (payload, args) => {
        return payload.msg;
      }
    }
  }
};

export default resolver;
