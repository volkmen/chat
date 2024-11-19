import { parse } from 'graphql/index';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { faker } from '@faker-js/faker';

export function addChatExecution(
  receiverId: number,
  executor: ReturnType<typeof buildHTTPExecutor> = global.defaultUserExecutor
): any {
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
