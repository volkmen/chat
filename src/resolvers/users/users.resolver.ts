import { createAuthResolver, parseQueryFields } from 'utils/resolvers';
import type { Context } from 'types/server';
import { UserEntity } from 'entities/User.entity';
import { getDataSourceAndUserId } from 'utils/context';
import { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';

const resolver = {
  Query: {
    GetMe: createAuthResolver((_, args, context: Context, info): Promise<UserEntity> => {
      const fieldsMap = parseQueryFields(info);
      const { userId, dataSource } = getDataSourceAndUserId(context, 'users');

      return dataSource.getUserById(userId, fieldsMap);
    }),

    GetUsers: createAuthResolver(async (_, args, context: Context, info): Promise<UserEntity[]> => {
      const fieldsMap = parseQueryFields(info);
      const { userId, dataSource } = getDataSourceAndUserId(context, 'users');
      return dataSource.getUsers(userId, fieldsMap);
    }),

    DeleteMe: createAuthResolver<{ id: number }, Promise<number>>(async (_, args, context: Context) => {
      const { userId, dataSource } = getDataSourceAndUserId(context, 'users');
      return dataSource.deleteUser(userId); // Return the ID of the deleted auth
    })
  },
  Mutation: {
    UpdateMe: createAuthResolver(async (_, { username }: { username: string }, context): Promise<UserEntity> => {
      const { userId, dataSource } = getDataSourceAndUserId(context, 'users');
      return dataSource.updateUser(userId, { username }); // Using args.input for updated data
    })
  }
};

export default resolver;
