"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_resolver_1 = __importDefault(require("./auth/auth.resolver"));
const users_resolver_1 = __importDefault(require("./users/users.resolver"));
const chat_resolver_1 = __importDefault(require("./chats/chat.resolver"));
exports.default = [auth_resolver_1.default, users_resolver_1.default, chat_resolver_1.default];
