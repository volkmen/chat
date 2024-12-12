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

export class BadRequestError extends GraphQLError {
  constructor(msg: string) {
    super(msg, {
      extensions: {
        http: {
          status: 403
        }
      }
    });
  }
}

export class NotImplementedError extends GraphQLError {
  constructor(msg: string) {
    super(msg, {
      extensions: {
        http: {
          status: 501
        }
      }
    });
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(msg: string) {
    super(msg, {
      extensions: {
        http: {
          status: 403
        }
      }
    });
  }
}
