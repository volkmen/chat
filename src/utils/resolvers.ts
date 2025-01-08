import { UnAuthorisedError } from './errors';
import { Context } from '../types/server';
import { GraphQLResolveInfo } from 'graphql/type';
import { isString } from 'class-validator';
import { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
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

export function parseQueryFields(requestInfoField: GraphQLResolveInfo) {
  const parsedResolveInfoFragment = parseResolveInfo(requestInfoField);
  const simplifiedFragment = simplifyParsedResolveInfoFragmentWithType(
    parsedResolveInfoFragment as any,
    requestInfoField.returnType
  );

  return simplifiedFragment.fields;
}
