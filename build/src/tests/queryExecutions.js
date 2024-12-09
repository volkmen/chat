"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatsExecution = getChatsExecution;
exports.getChatExecution = getChatExecution;
exports.addChatExecution = addChatExecution;
exports.makeSignUpExecution = makeSignUpExecution;
exports.getExecutor = getExecutor;
exports.addMessageExecution = addMessageExecution;
const index_1 = require("graphql/index");
const executor_http_1 = require("@graphql-tools/executor-http");
const faker_1 = require("@faker-js/faker");
function getChatsExecution(executor = global.defaultUserExecutor) {
    return executor({
        document: (0, index_1.parse)(/* GraphQL */ `
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
function getChatExecution(id, executor = global.defaultUserExecutor) {
    return executor({
        document: (0, index_1.parse)(/* GraphQL */ `
        query GetChat {
            GetChat(id: ${id}) {
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
function addChatExecution(receiverId, executor = global.defaultUserExecutor) {
    return executor({
        document: (0, index_1.parse)(/* GraphQL */ `
        mutation AddChat {
            AddChat(receiverId: "${receiverId}")
        }
    `)
    });
}
function makeSignUpExecution(args = { username: faker_1.faker.internet.username(), password: faker_1.faker.internet.password(), email: faker_1.faker.internet.email() }) {
    return global.signedOutExecutor({
        document: (0, index_1.parse)(/* GraphQL */ `
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
function getExecutor(jwtToken) {
    return (0, executor_http_1.buildHTTPExecutor)({
        fetch: global.server.yoga.fetch,
        endpoint: `/graphiql`,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    });
}
function addMessageExecution({ content, chatId }, executor = global.defaultUserExecutor) {
    return executor({
        document: (0, index_1.parse)(/* GraphQL */ `
      mutation AddMessage($chatId: ID!, $content: String!) {
        AddMessage(chatId: $chatId, content: $content) {
          id
        }
      }
    `),
        variables: {
            chatId,
            content
        }
    });
}
