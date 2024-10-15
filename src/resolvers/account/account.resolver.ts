import { Account } from 'types/graphql';

const resolver = {
  Query: {
    GetAccount: async (_, args, context, info): Promise<Account> => {
      console.log('!!!!!!!!!!!!!!!!!!!!!');
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
      const accountDataSource = context.dataSources.account;
      return accountDataSource.addAccount(args); // Using args.input based on the schema
    },

    UpdateAccount: async (_, { id, username }: { id: number; username: string }, context, info): Promise<Account> => {
      const accountDataSource = context.dataSources.account;
      return accountDataSource.updateAccount(id, { username }); // Using args.input for updated data
    },

    DeleteAccount: async (_, args, context, info): Promise<number> => {
      const accountDataSource = context.dataSources.account;
      return accountDataSource.deleteAccount(args.id); // Return the ID of the deleted account
    }
  }
};

export default resolver;
