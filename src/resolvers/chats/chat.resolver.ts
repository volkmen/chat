import { createAuthResolver, getQueryFieldsMapFromGraphQLRequestedInfo } from 'utils/resolvers';
import { Context } from 'types/server';
import { getDataSourceAndUserId } from 'utils/context';

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
    AddChat: createAuthResolver<{ receiverId: number }>((_, args, context: Context) => {
      const { dataSource, userId } = getDataSourceAndUserId(context, 'chats');
      return dataSource.addChat(userId, args);
    })
  }
};

export default resolver;
