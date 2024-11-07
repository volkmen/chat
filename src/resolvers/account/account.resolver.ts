import { type Context } from 'types/server';
import { UserEntity } from '../../entities/User.entity';
import { SignInInput } from './types';
import { getAccountResource, getUserIdFromContext } from 'utils/context';
import { createAuthResolver } from 'utils/resolvers';
import { NotImplementedError } from 'utils/errors';

const resolver = {
  Query: {
    Me: createAuthResolver((_, args, context: Context): Promise<UserEntity> => {
      const accountDataSource = getAccountResource(context);
      const userId = getUserIdFromContext(context);
      return accountDataSource.getAccountById(userId);
    }),

    GetAccounts: createAuthResolver(async (_, args, context: Context): Promise<UserEntity[]> => {
      const accountDataSource = getAccountResource(context);
      return accountDataSource.getAccounts();
    }),

    ResetPassword: createAuthResolver((_, args, context: Context) => {
      throw new NotImplementedError('Not implemented');
    }),

    ResendVerificationToken: createAuthResolver(async (_, args, context: Context) => {
      const userId = getUserIdFromContext(context);
      const {
        dataSources: { account: accountDataSource },
        emailVerificationService
      } = context;

      const account = await accountDataSource.updateEmailToken(userId);
      emailVerificationService.sendEmailVerificationToken({ to: account.email, token: account.email_token });

      return userId;
    })
  },

  Mutation: {
    SignUp: async (_, args, context: Context, info): Promise<UserEntity & { jwtToken: string }> => {
      const {
        dataSources: { account: accountDataSource },
        emailVerificationService,
        jwtService
      } = context;

      const account = await accountDataSource.signUp(args);
      emailVerificationService.sendEmailVerificationToken({ to: account.email, token: account.email_token });

      const jwtToken = await jwtService.createToken({ id: account.id });

      return { ...account, jwtToken };
    },

    UpdateMe: createAuthResolver(async (_, { username }: { username: string }, context): Promise<UserEntity> => {
      const accountDataSource = getAccountResource(context);
      const userId = getUserIdFromContext(context);

      return accountDataSource.updateAccount(userId, { username }); // Using args.input for updated data
    }),

    DeleteMe: createAuthResolver<{ id: number }, Promise<number>>(async (_, args, context: Context) => {
      const accountDataSource = context.dataSources.account;
      const userId = getUserIdFromContext(context);
      return accountDataSource.deleteAccount(userId); // Return the ID of the deleted account
    }),

    VerifyEmail: createAuthResolver(async (_, args: { token: number }, context): Promise<UserEntity> => {
      const accountDataSource = getAccountResource(context);
      const userId = getUserIdFromContext(context);

      return accountDataSource.verifyEmail(userId, args.token);
    }),

    SignIn: async (_, args: SignInInput, context: Context): Promise<UserEntity & { jwtToken: string }> => {
      const {
        dataSources: { account: accountDataSource },
        jwtService
      } = context;
      const account = await accountDataSource.signIn(args);
      if (account) {
        const jwtToken = await jwtService.createToken({ id: account.id });
        return { ...account, jwtToken };
      }
    }
  }
};

export default resolver;
