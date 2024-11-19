import { createAuthResolver } from 'utils/resolvers';
import { Context } from 'types/server';
import { NotImplementedError } from 'utils/errors';
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
    GetChatPbKey: createAuthResolver((_, args, context: Context) => {
      throw new NotImplementedError('Not implemented');
    })
  },
  Mutation: {
    AddChat: createAuthResolver<{ pbKey: string; receiverId: number }>((_, args, context: Context) => {
      const {
        dataSources: { chats: chatsDataSource }
      } = context;
      const userId = getUserIdFromContext(context);
      return chatsDataSource.addChat(userId, args);
    })
  }
};

export default resolver;
