"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolvers_1 = require("utils/resolvers");
const context_1 = require("utils/context");
const resolver = {
    Query: {
        GetChats: (0, resolvers_1.createAuthResolver)((_, args, context) => {
            const { dataSources: { chats: chatsDataSource } } = context;
            const userId = (0, context_1.getUserIdFromContext)(context);
            return chatsDataSource.getChats(userId);
        }),
        GetChat: (0, resolvers_1.createAuthResolver)((_, args, context, info) => {
            const { dataSources: { chats: chatsDataSource } } = context;
            const userId = (0, context_1.getUserIdFromContext)(context);
            const fieldsMap = (0, resolvers_1.getQueryFieldsMapFromGraphQLRequestedInfo)(info);
            return chatsDataSource.getChatById({ userId, chatId: +args.id }, fieldsMap);
        }),
        GetMessages: (0, resolvers_1.createAuthResolver)((_, args, context) => {
            const { dataSources: { chats: chatsDataSource } } = context;
            const userId = (0, context_1.getUserIdFromContext)(context);
            return chatsDataSource.getMessages(userId, args.chatId);
        })
    },
    Mutation: {
        AddChat: (0, resolvers_1.createAuthResolver)((_, args, context) => {
            const { dataSources: { chats: chatsDataSource } } = context;
            const userId = (0, context_1.getUserIdFromContext)(context);
            return chatsDataSource.addChat(userId, args);
        }),
        AddMessage: (0, resolvers_1.createAuthResolver)((_, args, context) => {
            const { dataSources: { chats: chatsDataSource } } = context;
            const userId = (0, context_1.getUserIdFromContext)(context);
            return chatsDataSource.addMessage(userId, { chatId: args.chatId, content: args.content });
        }),
        DeleteMessage: (0, resolvers_1.createAuthResolver)((_, args, context) => {
            const { dataSources: { chats: chatsDataSource } } = context;
            const userId = (0, context_1.getUserIdFromContext)(context);
            return chatsDataSource.deleteMessage(userId, args.id);
        })
    }
};
exports.default = resolver;
