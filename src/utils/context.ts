import { type Context } from 'types/server';

export function getUserIdFromContext(ctx: Context) {
  return +ctx.tokenPayload.id;
}

export function getAccountResource(context: Context) {
  return context.dataSources.account;
}
