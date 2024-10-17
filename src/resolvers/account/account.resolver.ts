import { type Context } from 'types/server';
import { AccountEntity } from 'entities/Account.entity';
import { SignInInput } from './types';
import { getAccountResource, getUserIdFromContext } from 'utils/context';
import { createAuthResolver } from 'utils/resolvers';

const resolver = {
  Query: {
    Me: createAuthResolver((_, args, context: Context): Promise<AccountEntity> => {
      const accountDataSource = getAccountResource(context);
      const userId = getUserIdFromContext(context);
      return accountDataSource.getAccountById(userId);
    }),

    GetAccounts: createAuthResolver(async (_, args, context: Context): Promise<AccountEntity[]> => {
      const accountDataSource = getAccountResource(context);
      return accountDataSource.getAccounts();
    })
  },

  Mutation: {
    SignUp: async (_, args, context: Context, info): Promise<AccountEntity & { jwtToken: string }> => {
      const {
        dataSources: { account: accountDataSource },
        emailVerificationService,
        jwtService
      } = context;

      console.log('SIGN UP', jwtService);

      const account = await accountDataSource.addAccount(args);
      emailVerificationService.sendEmailVerificationToken({ to: account.email, token: account.emailToken });

      const jwtToken = await jwtService.createToken({ id: account.id });

      return { ...account, jwtToken };
    },

    UpdateMe: createAuthResolver(
      async (_, { id, username }: { id: number; username: string }, context): Promise<AccountEntity> => {
        const accountDataSource = getAccountResource(context);
        return accountDataSource.updateAccount(id, { username }); // Using args.input for updated data
      }
    ),

    DeleteMe: createAuthResolver<{ id: number }, Promise<number>>(async (_, args, context: Context) => {
      const accountDataSource = context.dataSources.account;
      return accountDataSource.deleteAccount(args.id); // Return the ID of the deleted account
    }),

    VerifyEmail: createAuthResolver(async (_, args: { token: number }, context): Promise<AccountEntity> => {
      const accountDataSource = getAccountResource(context);
      const userId = getUserIdFromContext(context);

      return accountDataSource.verifyEmail(userId, +args.token);
    }),

    SignIn: async (_, args: SignInInput, context: Context): Promise<AccountEntity> => {
      const accountDataSource = getAccountResource(context);
      return accountDataSource.signIn(args);
    }
  }
};

export default resolver;
