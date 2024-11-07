import { createAuthResolver } from 'utils/resolvers';
import type { Context } from 'types/server';
import { UserEntity } from 'entities/User.entity';
import { getUserIdFromContext, getUsersResource } from 'utils/context';

const resolver = {
  Query: {
    GetMe: createAuthResolver((_, args, context: Context): Promise<UserEntity> => {
      const usersDataSource = getUsersResource(context);
      const userId = getUserIdFromContext(context);

      return usersDataSource.getUserById(userId);
    }),

    GetUsers: createAuthResolver(async (_, args, context: Context): Promise<UserEntity[]> => {
      const usersDataSource = getUsersResource(context);
      return usersDataSource.getUsers();
    }),

    DeleteMe: createAuthResolver<{ id: number }, Promise<number>>(async (_, args, context: Context) => {
      const usersDataSource = getUsersResource(context);
      const userId = getUserIdFromContext(context);
      return usersDataSource.deleteUser(userId); // Return the ID of the deleted auth
    })
  },
  Mutation: {
    UpdateMe: createAuthResolver(async (_, { username }: { username: string }, context): Promise<UserEntity> => {
      const usersDataSource = getUsersResource(context);
      const userId = getUserIdFromContext(context);

      return usersDataSource.updateUser(userId, { username }); // Using args.input for updated data
    })
  }
};

export default resolver;
