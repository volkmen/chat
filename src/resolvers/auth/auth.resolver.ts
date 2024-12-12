import { type Context } from 'types/server';
import { UserEntity } from 'entities/User.entity';
import { SignInInput } from './types';
import { getDataSourceAndUserId, getUserIdFromContext } from 'utils/context';
import { createAuthResolver } from 'utils/resolvers';
import { NotImplementedError } from 'utils/errors';

const resolver = {
  Query: {
    ResetPassword: createAuthResolver(() => {
      throw new NotImplementedError('Not implemented');
    }),

    ResendVerificationToken: createAuthResolver(async (_, args, context: Context) => {
      const userId = getUserIdFromContext(context);
      const {
        dataSources: { auth: authDataResource },
        emailVerificationService
      } = context;

      const account = await authDataResource.updateEmailToken(userId);
      emailVerificationService.sendEmailVerificationToken({ to: account.email, token: account.email_token });

      return userId;
    })
  },

  Mutation: {
    SignUp: async (_, args, context: Context): Promise<UserEntity & { jwtToken: string }> => {
      const {
        dataSources: { auth: authDataResource },
        emailVerificationService,
        jwtService
      } = context;

      const account = await authDataResource.signUp(args);
      emailVerificationService.sendEmailVerificationToken({ to: account.email, token: account.email_token });

      const jwtToken = await jwtService.createToken({ id: account.id });

      return { ...account, jwtToken };
    },

    VerifyEmail: createAuthResolver(async (_, args: { token: number }, context): Promise<UserEntity> => {
      const { userId, dataSource } = getDataSourceAndUserId(context, 'auth');
      return dataSource.verifyEmail(userId, args.token);
    }),

    SignIn: async (_, args: SignInInput, context: Context): Promise<UserEntity & { jwtToken: string }> => {
      const {
        dataSources: { auth: authDataResource },
        jwtService
      } = context;
      const account = await authDataResource.signIn(args);
      if (account) {
        const jwtToken = await jwtService.createToken({ id: account.id });
        return { ...account, jwtToken };
      }
    }
  }
};

export default resolver;
