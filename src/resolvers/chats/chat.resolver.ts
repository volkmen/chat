import { createAuthResolver } from 'utils/resolvers';
import { Context } from 'types/server';
import { NotImplementedError } from 'utils/errors';

const resolver = {
  Query: {
    GetChats: createAuthResolver((_, args, context: Context) => {
      throw new NotImplementedError('Not implemented');
    }),
    GetChatPbKey: createAuthResolver((_, args, context: Context) => {
      throw new NotImplementedError('Not implemented');
    })
  },
  Mutation: {
    AddChat: createAuthResolver((_, args, context: Context) => {
      throw new NotImplementedError('Not implemented');
    })
  }
};

export default resolver;
