import { User } from 'types/graphql';

export default {
  Query: {
    GetUsers(parent: any, ctx: any): User[] {
      return [];
    },
    GetUser(parent: any, ctx: any): User {
      return {
        firstName: 'User',
        lastName: 'User',
        age: 35
      };
    }
  }
};
