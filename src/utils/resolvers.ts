import { UnAuthorisedError } from './errors';
import { Context } from '../types/server';
type Parent = unknown;
type Func<Args, Return> = (_: Parent, args: Args, context: Context, info: any) => Return;

export function createAuthResolver<Args, Return = any>(
  callbackResolverFunction: Func<Args, Return>
): Func<Args, Return> {
  return (_: Parent, args: Args, context: Context, info: any) => {
    console.log(args, context.tokenPayload, _);
    if (!context.tokenPayload) {
      throw new UnAuthorisedError('Token is missing');
    }
    return callbackResolverFunction(_, args, context, info);
  };
}
