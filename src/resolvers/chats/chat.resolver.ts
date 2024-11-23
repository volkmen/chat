import { createAuthResolver } from 'utils/resolvers';
import { Context } from 'types/server';
import { getUserIdFromContext } from 'utils/context';

const resolver = {
  Query: {
    GetChats: createAuthResolver((_, args, context: Context) => {
      const {
        dataSources: { chats: chatsDataSource }
      } = context;
      const userId = getUserIdFromContext(context);
      return chatsDataSource.getChats(userId);
    }),
    GetChat: createAuthResolver<{ id: number }>((_, args, context: Context) => {
      const {
        dataSources: { chats: chatsDataSource }
      } = context;
      const userId = getUserIdFromContext(context);

      return chatsDataSource.getChatById(userId, +args.id);
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
    AddMessage: createAuthResolver<{ content: string; chatId: number }>((_, args, context: Context) => {
      const {
        dataSources: { chats: chatsDataSource }
      } = context;
      const userId = getUserIdFromContext(context);
      return chatsDataSource.addMessage(userId, { chatId: args.chatId, content: args.content });
    }),
    DeleteMessage: createAuthResolver<{ id: number }>((_, args, context: Context) => {
      const {
        dataSources: { chats: chatsDataSource }
      } = context;
      const userId = getUserIdFromContext(context);
      return chatsDataSource.deleteMessage(userId, args.id);
    })
  }
};

export default resolver;
