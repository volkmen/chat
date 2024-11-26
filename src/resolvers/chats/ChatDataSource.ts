import { DataSource as ORMDataSource } from 'typeorm/data-source/DataSource';
import { ChatEntity } from 'entities/Chat.entity';
import { UserEntity } from 'entities/User.entity';
import { BadRequestError } from 'utils/errors';
import { MessageEntity } from 'entities/Message.entity';

export default class ChatDataSource {
  constructor(private dbConnection: ORMDataSource) {}

  private get repository() {
    return this.dbConnection.getRepository(ChatEntity);
  }

  getChats = async (userId: number) => {
    return this.repository
      .createQueryBuilder('C')
      .select('C.id', 'id')
      .addSelect("json_build_object('id', U.id, 'username', U.username)", 'correspondent')
      .innerJoin('UsersChats', 'UC', 'UC.chatsId = C.id')
      .innerJoin('Users', 'U', 'U.id = UC.usersId')
      .where('U.id != :id', { id: userId })
      .execute();
  };

  getChatById = async ({ chatId, userId }: { userId: number; chatId: number }, include: { messages?: boolean }) => {
    const includeMessages = 'messages' in include && Boolean(include.messages);

    const chats = await this.repository
      .createQueryBuilder('C')
      .select('C.id', 'id')
      .addSelect("json_build_object('id', U.id, 'username', U.username)", 'correspondent')
      .innerJoin('UsersChats', 'UC', 'UC.chatsId = C.id')
      .innerJoin('Users', 'U', 'U.id = UC.usersId')
      .where('U.id != :id and C.id = :chatId', { id: userId, chatId })
      .execute();

    const chat = chats[0];

    if (includeMessages) {
      const messages = await this.dbConnection
        .createQueryBuilder('Messages', 'M')
        .select('M.id', 'id')
        .addSelect('M.content', 'content')
        .where('M.chatId = :chatId', { chatId })
        .execute();

      return {
        ...chat,
        messages
      };
    }

    return chat;
  };

  async addChat(userId: number, { receiverId }: { receiverId: number }) {
    const queryRunner = this.dbConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const entityManager = queryRunner.manager;

    console.log(userId, receiverId);

    try {
      const chats = await entityManager
        .createQueryBuilder()
        .select('C.id', 'id')
        .addSelect('U.id', 'receiverId')
        .from('Chats', 'C')
        .innerJoin('UsersChats', 'UC', 'UC.chatsId = C.id')
        .innerJoin('Users', 'U', 'U.id = UC.usersId')
        .where('U.id = :receiverId', { receiverId })
        .execute();

      const userA = await entityManager.findOne(UserEntity, { where: { id: userId } });
      const userB = await entityManager.findOne(UserEntity, { where: { id: receiverId } });

      if (!userA || !userB) {
        return new BadRequestError('Receiver or user is not exists');
      }

      if (chats.length > 0) {
        return new BadRequestError('Chat is already exist');
      }

      const chatInsertResult = await entityManager
        .createQueryBuilder()
        .insert()
        .into(ChatEntity) // The table name, as defined in your entity
        .values([
          {
            is_group: false
          }
        ])
        .execute();

      const newChatId = chatInsertResult.identifiers[0].id;

      const newChat = await entityManager
        .createQueryBuilder(ChatEntity, 'c')
        .where('c.id = :newChatId', { newChatId })
        .getOne();

      await entityManager.createQueryBuilder().relation(UserEntity, 'chats').of(userA).add(newChat);
      await entityManager.createQueryBuilder().relation(UserEntity, 'chats').of(userB).add(newChat);

      await queryRunner.commitTransaction();

      return newChatId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  addMessage(userId: number, { chatId, content }: { chatId: number; content: string }) {
    return this.dbConnection.transaction(async entityManager => {
      const msgResult = await entityManager
        .createQueryBuilder()
        .insert()
        .into(MessageEntity)
        .values([{ content }])
        .execute();

      const newMsgId = msgResult.identifiers[0].id;

      const newMsg = await entityManager
        .createQueryBuilder(MessageEntity, 'msg')
        .where('msg.id = :newMsgId', { newMsgId })
        .getOne();

      const user = await entityManager
        .createQueryBuilder(UserEntity, 'user')
        .where('user.id = :userId', { userId })
        .getOne();
      const chat = await entityManager
        .createQueryBuilder(ChatEntity, 'chat')
        .where('chat.id = :chatId', { chatId })
        .getOne();

      await entityManager.createQueryBuilder().relation(MessageEntity, 'owner').of(newMsg).set(user);
      await entityManager.createQueryBuilder().relation(ChatEntity, 'messages').of(chat).add(newMsg);

      return newMsg;
    });
  }

  updateMessage(
    userId: number,
    { content, messageId, isRead }: { content?: string; messageId: number; isRead?: boolean }
  ) {
    const values = {
      ...(isRead ? { is_read: isRead } : {}),
      ...(content ? { content } : {})
    };
    return this.dbConnection
      .createQueryBuilder()
      .update(MessageEntity)
      .set(values)
      .where('id = :id', { id: messageId })
      .execute();
  }

  async deleteMessage(userId: number, messageId: number) {
    await this.dbConnection
      .createQueryBuilder()
      .delete()
      .from(MessageEntity)
      .where('id = :id and ownerId = :userId', { id: messageId, userId })
      .execute();

    return messageId;
  }

  async getMessages(userId: number, chatId: number) {
    const chatIsAccessibleForThisUser = await this.repository
      .createQueryBuilder('C')
      .select('C.id')
      .innerJoin('UsersChats', 'US', 'US.chatsId = C.id')
      .innerJoin('Users', 'U', 'US.usersId = U.id')
      .where('C.id = :chatId and U.id = :userId', { chatId, userId })
      .getOne();

    if (chatIsAccessibleForThisUser) {
      return this.dbConnection
        .createQueryBuilder('Messages', 'M')
        .select('M.id', 'id')
        .addSelect('M.content', 'content')
        .addSelect('M.created_at', 'created_at')
        .addSelect('U.id', 'sender_id')
        .innerJoin('Users', 'U', 'U.id = M.ownerId')
        .where('M.chatId = :chatId and M.ownerId = :userId', { chatId, userId })
        .execute();
    }

    throw new BadRequestError('Forbidden');
  }
}
