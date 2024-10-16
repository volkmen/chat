import { Account } from 'types/graphql';
import EmailVerificationService from '../../services/emailer';
import { Context } from '../../types/server';
import { AccountEntity } from '../../entities/Account.entity';

const resolver = {
  Query: {
    GetAccount: async (_, args, context, info): Promise<Account> => {
      const accountDataSource = context.dataSources.account;
      return accountDataSource.getAccountById(args.id);
    },

    GetAccounts: async (_, args, context, info): Promise<Account[]> => {
      const accountDataSource = context.dataSources.account;
      return accountDataSource.getAccounts();
    }
  },

  Mutation: {
    AddAccount: async (_, args, context: Context): Promise<AccountEntity> => {
      const {
        dataSources: { account: accountDataSource },
        emailVerificationService
      } = context;
      const account = await accountDataSource.addAccount(args);
      emailVerificationService.sendEmailVerificationToken({ to: account.email, token: account.emailToken });

      return account;
    },

    UpdateAccount: async (_, { id, username }: { id: number; username: string }, context, info): Promise<Account> => {
      const accountDataSource = context.dataSources.account;
      return accountDataSource.updateAccount(id, { username }); // Using args.input for updated data
    },

    DeleteAccount: async (_, args, context, info): Promise<number> => {
      const accountDataSource = context.dataSources.account;
      return accountDataSource.deleteAccount(args.id); // Return the ID of the deleted account
    },

    VerifyEmail: async (_, args, context, info): Promise<Account> => {
      const accountDataSource = context.dataSources.account;
      return accountDataSource.verifyEmail(args.id);
    }
  }
};

export default resolver;
