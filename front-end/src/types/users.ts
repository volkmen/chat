import { ApolloSuccessDataResponse } from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export type GetUsersResponse = ApolloSuccessDataResponse<'GetUsers', User[]>;
