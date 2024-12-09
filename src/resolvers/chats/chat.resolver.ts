import { createAuthResolver, getQueryFieldsMapFromGraphQLRequestedInfo } from 'utils/resolvers';
import { Context } from 'types/server';
import { getUserIdFromContext } from 'utils/context';
import { MessageEntity } from '../../entities/Message.entity';
import { ChatEvents } from '../../consts/events';

const setTimeout$ = function (delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
};

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
        console.log(`${ChatEvents.MESSAGE_WAS_ADDED}_${args.chatId}`);
        return pubsub.subscribe(`${ChatEvents.MESSAGE_WAS_ADDED}_${args.chatId}`);
      },
      resolve: (payload, args) => {
        console.log('Resolving subscription payload:', payload, 'with args:', args); // Debug here
        return payload.msg;
      }
    }
  }
};

export default resolver;
