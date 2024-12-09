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
const Chat_entity_1 = require("entities/Chat.entity");
const User_entity_1 = require("entities/User.entity");
const errors_1 = require("utils/errors");
const Message_entity_1 = require("entities/Message.entity");
class ChatDataSource {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        this.getChats = (userId) => __awaiter(this, void 0, void 0, function* () {
            const chatIdsQuery = this.createChatIdsQueryForUser(userId);
            return this.repository
                .createQueryBuilder('C')
                .select('C.id', 'id')
                .addSelect("json_build_object('id', U.id, 'username', U.username)", 'correspondent')
                .innerJoin('UsersChats', 'US', 'US.chatsId = C.id')
                .innerJoin('Users', 'U', 'U.id = US.usersId')
                .where(`C.id IN (${chatIdsQuery.getQuery()}) and U.id != :id`, { id: userId })
                .setParameters(chatIdsQuery.getParameters())
                .execute();
            // return correspondents;
        });
        this.getChatById = (_a, include_1) => __awaiter(this, [_a, include_1], void 0, function* ({ chatId, userId }, include) {
            const includeMessages = 'messages' in include && Boolean(include.messages);
            const chats = yield this.repository
                .createQueryBuilder('C')
                .select('C.id', 'id')
                .addSelect("json_build_object('id', U.id, 'username', U.username)", 'correspondent')
                .innerJoin('UsersChats', 'UC', 'UC.chatsId = C.id')
                .innerJoin('Users', 'U', 'U.id = UC.usersId')
                .where('U.id != :id and C.id = :chatId', { id: userId, chatId })
                .execute();
            const chat = chats[0];
            if (includeMessages) {
                const messages = yield this.dbConnection
                    .createQueryBuilder('Messages', 'M')
                    .select('M.id', 'id')
                    .addSelect('M.content', 'content')
                    .where('M.chatId = :chatId', { chatId })
                    .execute();
                return Object.assign(Object.assign({}, chat), { messages });
            }
            return chat;
        });
    }
    get repository() {
        return this.dbConnection.getRepository(Chat_entity_1.ChatEntity);
    }
    createChatIdsQueryForUser(userId) {
        return this.repository
            .createQueryBuilder('C')
            .select('C.id', 'id')
            .innerJoin('UsersChats', 'UC', 'UC.chatsId = C.id')
            .innerJoin('Users', 'U', 'U.id = UC.usersId')
            .where('U.id = :userId', { userId });
    }
    addChat(userId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (userId, { receiverId }) {
            const queryRunner = this.dbConnection.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            const entityManager = queryRunner.manager;
            try {
                const userA = yield entityManager.findOne(User_entity_1.UserEntity, { where: { id: userId } });
                const userB = yield entityManager.findOne(User_entity_1.UserEntity, { where: { id: receiverId } });
                if (!userA || !userB) {
                    return new errors_1.BadRequestError('Receiver or user is not exists');
                }
                const chatIdsQuery = this.createChatIdsQueryForUser(userId);
                const userChats = yield entityManager
                    .createQueryBuilder()
                    .select('C.id', 'id')
                    .addSelect('U.id', 'receiverId')
                    .from('Chats', 'C')
                    .innerJoin('UsersChats', 'UC', 'UC.chatsId = C.id')
                    .innerJoin('Users', 'U', 'U.id = UC.usersId')
                    .where(`C.id IN (${chatIdsQuery.getQuery()}) and U.id = :id`, { id: receiverId })
                    .setParameters(chatIdsQuery.getParameters())
                    .execute();
                if (userChats.length > 0) {
                    return new errors_1.BadRequestError('Chat is already exist');
                }
                const chatInsertResult = yield entityManager
                    .createQueryBuilder()
                    .insert()
                    .into(Chat_entity_1.ChatEntity) // The table name, as defined in your entity
                    .values([
                    {
                        is_group: false
                    }
                ])
                    .execute();
                const newChatId = chatInsertResult.identifiers[0].id;
                const newChat = yield entityManager
                    .createQueryBuilder(Chat_entity_1.ChatEntity, 'c')
                    .where('c.id = :newChatId', { newChatId })
                    .getOne();
                yield entityManager.createQueryBuilder().relation(User_entity_1.UserEntity, 'chats').of(userA).add(newChat);
                yield entityManager.createQueryBuilder().relation(User_entity_1.UserEntity, 'chats').of(userB).add(newChat);
                yield queryRunner.commitTransaction();
                return newChatId;
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    addMessage(userId, { chatId, content }) {
        return this.dbConnection.transaction((entityManager) => __awaiter(this, void 0, void 0, function* () {
            const msgResult = yield entityManager
                .createQueryBuilder()
                .insert()
                .into(Message_entity_1.MessageEntity)
                .values([{ content }])
                .execute();
            const newMsgId = msgResult.identifiers[0].id;
            const newMsg = yield entityManager
                .createQueryBuilder(Message_entity_1.MessageEntity, 'msg')
                .where('msg.id = :newMsgId', { newMsgId })
                .getOne();
            const user = yield entityManager
                .createQueryBuilder(User_entity_1.UserEntity, 'user')
                .where('user.id = :userId', { userId })
                .getOne();
            const chat = yield entityManager
                .createQueryBuilder(Chat_entity_1.ChatEntity, 'chat')
                .where('chat.id = :chatId', { chatId })
                .getOne();
            yield entityManager.createQueryBuilder().relation(Message_entity_1.MessageEntity, 'owner').of(newMsg).set(user);
            yield entityManager.createQueryBuilder().relation(Chat_entity_1.ChatEntity, 'messages').of(chat).add(newMsg);
            return newMsg;
        }));
    }
    updateMessage(userId, { content, messageId, isRead }) {
        const values = Object.assign(Object.assign({}, (isRead ? { is_read: isRead } : {})), (content ? { content } : {}));
        return this.dbConnection
            .createQueryBuilder()
            .update(Message_entity_1.MessageEntity)
            .set(values)
            .where('id = :id', { id: messageId })
            .execute();
    }
    deleteMessage(userId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dbConnection
                .createQueryBuilder()
                .delete()
                .from(Message_entity_1.MessageEntity)
                .where('id = :id and ownerId = :userId', { id: messageId, userId })
                .execute();
            return messageId;
        });
    }
    getMessages(userId, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatIsAccessibleForThisUser = yield this.repository
                .createQueryBuilder('C')
                .select('C.id')
                .innerJoin('UsersChats', 'US', 'US.chatsId = C.id')
                .innerJoin('Users', 'U', 'US.usersId = U.id')
                .where('C.id = :chatId and U.id = :userId', { chatId, userId })
                .execute();
            console.log(chatIsAccessibleForThisUser);
            if (chatIsAccessibleForThisUser) {
                return this.dbConnection
                    .createQueryBuilder('Messages', 'M')
                    .select('M.id', 'id')
                    .addSelect('M.content', 'content')
                    .addSelect('M.created_at', 'created_at')
                    .addSelect('U.id', 'sender_id')
                    .innerJoin('Users', 'U', 'U.id = M.ownerId')
                    .where('M.chatId = :chatId', { chatId })
                    .execute();
            }
            throw new errors_1.BadRequestError('Forbidden');
        });
    }
}
exports.default = ChatDataSource;
