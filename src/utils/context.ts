import { type Context } from 'types/server';

export function getUserIdFromContext(ctx: Context) {
  return +ctx.tokenPayload.id;
}

export function getAuthResource(context: Context) {
  return context.dataSources.auth;
}

export function getUsersResource(context: Context) {
  return context.dataSources.users;
}
