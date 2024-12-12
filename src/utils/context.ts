import { type Context } from 'types/server';

export function getUserIdFromContext(ctx: Context) {
  return +ctx.tokenPayload.id;
}

export function getDataSource<T extends keyof Context['dataSources']>(
  context: Context,
  key: T
): Context['dataSources'][T] {
  return context.dataSources[key];
}

export function getDataSourceAndUserId<T extends keyof Context['dataSources']>(context: Context, key: T) {
  return {
    userId: getUserIdFromContext(context),
    dataSource: getDataSource<T>(context, key)
  };
}
