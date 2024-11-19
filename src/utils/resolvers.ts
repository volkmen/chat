import { UnAuthorisedError } from './errors';
import { Context } from '../types/server';
import { GraphQLResolveInfo } from 'graphql/type';
import { isString } from 'class-validator';
type Parent = unknown;
type Func<Args, Return> = (_: Parent, args: Args, context: Context, info: any) => Return;

export function createAuthResolver<Args, Return = any>(
  callbackResolverFunction: Func<Args, Return>
): Func<Args, Return> {
  return (_: Parent, args: Args, context: Context, info: GraphQLResolveInfo) => {
    if (!context.tokenPayload) {
      throw new UnAuthorisedError('Token is missing');
    }
    return callbackResolverFunction(_, args, context, info);
  };
}

export function getQueryFieldsMapFromGraphQLRequestedInfo(requestInfoField: GraphQLResolveInfo) {
  return requestInfoField.fieldNodes[0].selectionSet.selections.reduce<Record<string, boolean>>((acc, sel) => {
    if ('name' in sel && isString(sel.name.value)) {
      acc[sel.name.value] = true;
    }
    return acc;
  }, {});
}
