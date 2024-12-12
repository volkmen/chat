import type EmailVerificationService from '../services/emailer';
import type JwtService from '../services/jwtService';
import AuthDataSource from '../resolvers/auth/AuthDataSource';
import UsersDataSource from '../resolvers/users/UsersDataSource';
import ChatDataSource from '../resolvers/chats/ChatDataSource';
import { createPubSub } from 'graphql-yoga';
import MessagesDataSource from '../resolvers/messages/MessagesDataSource';

type DataSources = {
  auth: AuthDataSource;
  users: UsersDataSource;
  chats: ChatDataSource;
  messages: MessagesDataSource;
};
export type Context = {
  dataSources: DataSources;
  pubsub: ReturnType<typeof createPubSub>;
  emailVerificationService: EmailVerificationService;
  jwtService: JwtService;
  tokenPayload: {
    id: number;
  } | null;
};
