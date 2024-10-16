import { GraphQLError } from 'graphql/error';

export class UnAuthorisedError extends GraphQLError {
  constructor(msg: string) {
    super(msg, {
      extensions: {
        http: {
          status: 401
        }
      }
    });
  }
}
