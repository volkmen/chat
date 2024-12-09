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
const queryExecutions_1 = require("./queryExecutions");
const index_1 = require("graphql/index");
describe('chat', () => {
    let executor;
    beforeAll(() => {
        executor = globalThis.defaultUserExecutor;
    });
    it('should not add chat if receiver does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const createChatResult = yield (0, queryExecutions_1.addChatExecution)(10);
        expect(createChatResult.errors.length).toBe(1);
    }));
    it('should add chat if receiver', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, queryExecutions_1.makeSignUpExecution)();
        expect(result.data).toBeTruthy();
        const receiverId = result.data.SignUp.id;
        const createChatResult = yield (0, queryExecutions_1.addChatExecution)(receiverId);
        const createChatResultError = yield (0, queryExecutions_1.addChatExecution)(receiverId);
        expect(createChatResult.data).toBeTruthy();
        expect(createChatResultError.errors.length > 0).toBeTruthy();
        const usersResult = yield executor({
            document: (0, index_1.parse)(/* GraphQL */ `
        query GetUser {
          GetMe {
            username
            email
            chats {
              id
            }
          }
        }
      `)
        });
        expect(usersResult.data.GetMe).toBeTruthy();
        expect(usersResult.data.GetMe.chats.length).toBeTruthy();
    }));
    it('should return all user chats', () => __awaiter(void 0, void 0, void 0, function* () {
        const chatsBefore = yield (0, queryExecutions_1.getChatsExecution)();
        const lenChats = chatsBefore.data.GetChats.length;
        const result1 = yield (0, queryExecutions_1.makeSignUpExecution)();
        expect(result1.data).toBeTruthy();
        const receiverId1 = result1.data.SignUp.id;
        yield (0, queryExecutions_1.addChatExecution)(receiverId1);
        const result2 = yield (0, queryExecutions_1.makeSignUpExecution)();
        expect(result2.data).toBeTruthy();
        const receiverId2 = result2.data.SignUp.id;
        yield (0, queryExecutions_1.addChatExecution)(receiverId2);
        const result3 = yield (0, queryExecutions_1.makeSignUpExecution)();
        expect(result3.data).toBeTruthy();
        const receiverId3 = result3.data.SignUp.id;
        yield (0, queryExecutions_1.addChatExecution)(receiverId3);
        const chatsAfter = yield (0, queryExecutions_1.getChatsExecution)();
        expect(chatsAfter.data.GetChats.length === 3 + lenChats).toBe(true);
    }));
    it('should return user chat by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, queryExecutions_1.makeSignUpExecution)();
        expect(result.data).toBeTruthy();
        const receiverId = result.data.SignUp.id;
        const resultAddChat = yield (0, queryExecutions_1.addChatExecution)(receiverId);
        const chatId = resultAddChat.data.AddChat;
        const chat = yield executor({
            document: (0, index_1.parse)(/* GraphQL */ `
        query GetChat {
          GetChat(id: ${chatId}) {
            id
            correspondent {
              id
              username
            }
          }
        }
      `)
        });
        expect(chat.data.GetChat.correspondent).toBeTruthy();
        const receiverExecutor = (0, queryExecutions_1.getExecutor)(result.data.SignUp.jwtToken);
        const addChatException = yield (0, queryExecutions_1.addChatExecution)(1, receiverExecutor);
        expect(addChatException.errors.length).toBe(1);
    }));
    it('add message', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, queryExecutions_1.makeSignUpExecution)();
        expect(result.data).toBeTruthy();
        const receiverId = result.data.SignUp.id;
        const resultAddChat = yield (0, queryExecutions_1.addChatExecution)(receiverId);
        const chatId = +resultAddChat.data.AddChat;
        const addMessage = yield (0, queryExecutions_1.addMessageExecution)({ chatId, content: 'I am message here' });
        expect(addMessage.data.AddMessage).toBeTruthy();
    }));
    it('delete message', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, queryExecutions_1.makeSignUpExecution)();
        expect(result.data).toBeTruthy();
        const receiverId = result.data.SignUp.id;
        const resultAddChat = yield (0, queryExecutions_1.addChatExecution)(receiverId);
        const chatId = +resultAddChat.data.AddChat;
        const addMessage = yield (0, queryExecutions_1.addMessageExecution)({ chatId, content: 'I am message here' });
        expect(addMessage.data.AddMessage).toBeTruthy();
        const msgId = addMessage.data.AddMessage.id;
        const delMsgResult = yield global.defaultUserExecutor({
            document: (0, index_1.parse)(/* GraphQL */ `
        mutation DeleteMessage {
          DeleteMessage(id: ${msgId})
        }
      `)
        });
        expect(delMsgResult.data.DeleteMessage).toBeTruthy();
    }));
});
