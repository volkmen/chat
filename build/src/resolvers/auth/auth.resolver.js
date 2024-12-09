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
const context_1 = require("utils/context");
const resolvers_1 = require("utils/resolvers");
const errors_1 = require("utils/errors");
const resolver = {
    Query: {
        ResetPassword: (0, resolvers_1.createAuthResolver)((_, args, context) => {
            throw new errors_1.NotImplementedError('Not implemented');
        }),
        ResendVerificationToken: (0, resolvers_1.createAuthResolver)((_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, context_1.getUserIdFromContext)(context);
            const { dataSources: { auth: authDataResource }, emailVerificationService } = context;
            const account = yield authDataResource.updateEmailToken(userId);
            emailVerificationService.sendEmailVerificationToken({ to: account.email, token: account.email_token });
            return userId;
        }))
    },
    Mutation: {
        SignUp: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { dataSources: { auth: authDataResource }, emailVerificationService, jwtService } = context;
            const account = yield authDataResource.signUp(args);
            emailVerificationService.sendEmailVerificationToken({ to: account.email, token: account.email_token });
            const jwtToken = yield jwtService.createToken({ id: account.id });
            return Object.assign(Object.assign({}, account), { jwtToken });
        }),
        VerifyEmail: (0, resolvers_1.createAuthResolver)((_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const authDataResource = (0, context_1.getAuthResource)(context);
            const userId = (0, context_1.getUserIdFromContext)(context);
            return authDataResource.verifyEmail(userId, args.token);
        })),
        SignIn: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { dataSources: { auth: authDataResource }, jwtService } = context;
            const account = yield authDataResource.signIn(args);
            if (account) {
                const jwtToken = yield jwtService.createToken({ id: account.id });
                return Object.assign(Object.assign({}, account), { jwtToken });
            }
        })
    }
};
exports.default = resolver;
