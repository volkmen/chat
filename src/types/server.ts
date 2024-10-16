import type AccountDataSource from '../resolvers/account/AccountDataSource';
import type EmailVerificationService from '../services/emailer';

export type Context = {
  dataSources: {
    account: AccountDataSource;
  };
  emailVerificationService: EmailVerificationService;
};
