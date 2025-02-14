import type EmailVerificationService from '../services/emailer';
import type JwtService from '../services/jwtService';
import AuthDataSource from '../resolvers/auth/AuthDataSource';
import UsersDataSource from '../resolvers/users/UsersDataSource';
import ChatDataSource from '../resolvers/chats/ChatDataSource';
import { createPubSub } from 'graphql-yoga';
import MessagesDataSource from '../resolvers/messages/MessagesDataSource';
import { S3Provider } from '../services/s3';

type DataSources = {
  auth: AuthDataSource;
  users: UsersDataSource;
  chats: ChatDataSource;
  messages: MessagesDataSource;
  s3Provider: S3Provider;
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
