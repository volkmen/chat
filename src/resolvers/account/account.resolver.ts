import { Account } from 'types/graphql';
import { type Context } from 'types/server';
import { AccountEntity } from 'entities/Account.entity';
import type AccountDataSource from './AccountDataSource';
import { SignInInput } from './types';

function getAccountResource(context: Context): AccountDataSource {
  return context.dataSources.account;
}

const resolver = {
  Query: {
    GetAccount: async (_, args, context: Context): Promise<AccountEntity> => {
      const accountDataSource = getAccountResource(context);
      return accountDataSource.getAccountById(args.id);
    },

    GetAccounts: async (_, args, context: Context): Promise<AccountEntity[]> => {
      const accountDataSource = getAccountResource(context);
      return accountDataSource.getAccounts();
    }
  },

  Mutation: {
    AddAccount: async (_, args, context: Context): Promise<AccountEntity & { jwtToken: string }> => {
      const {
        dataSources: { account: accountDataSource },
        emailVerificationService,
        jwtService
      } = context;
      const account = await accountDataSource.addAccount(args);
      emailVerificationService.sendEmailVerificationToken({ to: account.email, token: account.emailToken });

      const jwtToken = await jwtService.createToken({ id: account.id });

      return { ...account, jwtToken };
    },

    UpdateAccount: async (_, { id, username }: { id: number; username: string }, context): Promise<AccountEntity> => {
      const accountDataSource = getAccountResource(context);
      return accountDataSource.updateAccount(id, { username }); // Using args.input for updated data
    },

    DeleteAccount: async (_, args, context: Context, info): Promise<number> => {
      const accountDataSource = context.dataSources.account;
      return accountDataSource.deleteAccount(args.id); // Return the ID of the deleted account
    },

    VerifyEmail: async (_, args, context: Context, info): Promise<AccountEntity> => {
      const accountDataSource = context.dataSources.account;
      return accountDataSource.verifyEmail(args.id);
    },

    SignIn: async (_, args: SignInInput, context: Context): Promise<AccountEntity> => {
      const accountDataSource = getAccountResource(context);
      return accountDataSource.signin(args);
    }
  }
};

export default resolver;
