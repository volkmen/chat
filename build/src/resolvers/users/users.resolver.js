"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolvers_1 = require("utils/resolvers");
const context_1 = require("utils/context");
const resolver = {
    Query: {
        GetMe: (0, resolvers_1.createAuthResolver)((_, args, context, info) => {
            const fieldsMap = (0, resolvers_1.getQueryFieldsMapFromGraphQLRequestedInfo)(info);
            const usersDataSource = (0, context_1.getUsersResource)(context);
            const userId = (0, context_1.getUserIdFromContext)(context);
            return usersDataSource.getUserById(userId, fieldsMap);
        }),
        GetUsers: (0, resolvers_1.createAuthResolver)((_, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
            const fieldsMap = (0, resolvers_1.getQueryFieldsMapFromGraphQLRequestedInfo)(info);
            const userId = (0, context_1.getUserIdFromContext)(context);
            const usersDataSource = (0, context_1.getUsersResource)(context);
            return usersDataSource.getUsers(userId, fieldsMap);
        })),
        DeleteMe: (0, resolvers_1.createAuthResolver)((_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const usersDataSource = (0, context_1.getUsersResource)(context);
            const userId = (0, context_1.getUserIdFromContext)(context);
            return usersDataSource.deleteUser(userId); // Return the ID of the deleted auth
        }))
    },
    Mutation: {
        UpdateMe: (0, resolvers_1.createAuthResolver)((_1, _a, context_2) => __awaiter(void 0, [_1, _a, context_2], void 0, function* (_, { username }, context) {
            const usersDataSource = (0, context_1.getUsersResource)(context);
            const userId = (0, context_1.getUserIdFromContext)(context);
            return usersDataSource.updateUser(userId, { username }); // Using args.input for updated data
        }))
    }
};
exports.default = resolver;
