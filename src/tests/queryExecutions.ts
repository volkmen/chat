import { parse } from 'graphql/index';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { faker } from '@faker-js/faker';
import { SyncExecutor } from '@graphql-tools/utils';
import { HTTPExecutorOptions } from '@graphql-tools/executor-http/typings';

export function getChatsExecution(executor = global.defaultUserExecutor) {
  return executor({
    document: parse(/* GraphQL */ `
      query GetChats {
        GetChats {
          id
          correspondent {
            id
            username
          }
        }
      }
    `)
  });
}

export function addChatExecution(
  receiverId: number,
  executor: SyncExecutor<any, HTTPExecutorOptions> = global.defaultUserExecutor
) {
  return executor({
    document: parse(/* GraphQL */ `
        mutation AddChat {
            AddChat(receiverId: "${receiverId}")
        }
    `)
  });
}

export function makeSignUpExecution(
  args = { username: faker.internet.username(), password: faker.internet.password(), email: faker.internet.email() }
): any {
  return global.signedOutExecutor({
    document: parse(/* GraphQL */ `
        mutation SignUp {
            SignUp(username: "${args.username}", email: "${args.email}", password: "${args.password}") {
                username
                is_verified
                jwtToken
                id
            }
        }
    `),
    operationName: 'SignUp'
  });
}

export function getExecutor(jwtToken) {
  return buildHTTPExecutor({
    fetch: global.server.yoga.fetch,
    endpoint: `/graphiql`,
    headers: {
      Authorization: `Bearer ${jwtToken}`
    }
  });
}
