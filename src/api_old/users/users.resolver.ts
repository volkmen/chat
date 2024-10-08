import { User } from './types';

export default {
  Query: {
    GetUsers(parent: any, ctx: any): User[] {
      return [];
    },
    GetUser(parent: any, ctx: any): User {
      return {
        id: 1,
        firstName: 'User',
        lastName: 'User',
        age: 35
      };
    }
  }
};
