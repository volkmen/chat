import { Account } from 'types/graphql';

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
    AddAccount: async (_, args, context, info): Promise<number> => {
      console.log(args, context);
      const accountDataSource = context.dataSources.account;
      return accountDataSource.addAccount(args); // Using args.input based on the schema
    },

    UpdateAccount: async (
      _,
      args: { id: number; input: { is_verified: boolean } },
      context,
      info
    ): Promise<Account> => {
      const accountDataSource = context.dataSources.account;
      return accountDataSource.updateAccount(args.id, args.input); // Using args.input for updated data
    },

    DeleteAccount: async (_, args, context, info): Promise<number> => {
      const accountDataSource = context.dataSources.account;
      return accountDataSource.deleteAccount(args.id); // Return the ID of the deleted account
    }
  }
};

export default resolver;
