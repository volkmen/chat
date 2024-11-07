import type EmailVerificationService from '../services/emailer';
import type JwtService from '../services/jwtService';
import AuthDataSource from '../resolvers/auth/AuthDataSource';
import UsersDataSource from '../resolvers/users/UsersDataSource';

export type Context = {
  dataSources: {
    auth: AuthDataSource;
    users: UsersDataSource;
  };
  emailVerificationService: EmailVerificationService;
  jwtService: JwtService;
  tokenPayload: {
    id: number;
  } | null;
};
