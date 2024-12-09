import type EmailVerificationService from '../services/emailer';
import type JwtService from '../services/jwtService';
import AuthDataSource from '../resolvers/auth/AuthDataSource';
import UsersDataSource from '../resolvers/users/UsersDataSource';
import ChatDataSource from '../resolvers/chats/ChatDataSource';
import { PubSub } from 'graphql-yoga';

export type Context = {
  dataSources: {
    auth: AuthDataSource;
    users: UsersDataSource;
    chats: ChatDataSource;
  };
  pubsub: PubSub<any>;
  emailVerificationService: EmailVerificationService;
  jwtService: JwtService;
  tokenPayload: {
    id: number;
  } | null;
};
