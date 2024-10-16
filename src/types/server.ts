import type AccountDataSource from '../resolvers/account/AccountDataSource';
import type EmailVerificationService from '../services/emailer';
import type JwtService from '../services/jwtService';

export type Context = {
  dataSources: {
    account: AccountDataSource;
  };
  emailVerificationService: EmailVerificationService;
  jwtService: JwtService;
};
