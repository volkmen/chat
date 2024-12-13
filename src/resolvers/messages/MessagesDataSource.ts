import { DataSource as ORMDataSource } from 'typeorm/data-source/DataSource';
import { ChatEntity } from 'entities/Chat.entity';
import { UserEntity } from 'entities/User.entity';
import { BadRequestError, ForbiddenError } from 'utils/errors';
import { MessageEntity } from 'entities/Message.entity';
import { plainToInstance } from 'class-transformer';

export default class MessagesDataSource {
  constructor(private dbConnection: ORMDataSource) {}

  private get repository() {
    return this.dbConnection.getRepository(MessageEntity);
  }

  async getMessageById(userId: number, id: number) {
    const messages = await this.repository
      .createQueryBuilder('M')
      .select('M.id', 'id')
      .addSelect('M.content', 'content')
      .addSelect('M.created_at', 'createdAt')
      .addSelect('M.is_read', 'isRead')
      .where('M.id = :id and M.ownerId = :userId', { userId, id })
      .execute();

    return messages[0];
  }

  async getMessages(userId: number, chatId: number) {
    const chatIsAccessibleForThisUser = await this.repository
      .createQueryBuilder('C')
      .select('C.id')
      .innerJoin('UsersChats', 'US', 'US.chatsId = C.id')
      .innerJoin('Users', 'U', 'US.usersId = U.id')
      .where('C.id = :chatId and U.id = :userId', { chatId, userId })
      .execute();

    if (chatIsAccessibleForThisUser) {
      return this.dbConnection
        .createQueryBuilder('Messages', 'M')
        .select('M.id', 'id')
        .addSelect('M.content', 'content')
        .addSelect('M.created_at', 'createdAt')
        .addSelect('U.id', 'senderId')
        .innerJoin('Users', 'U', 'U.id = M.ownerId')
        .where('M.chatId = :chatId', { chatId })
        .execute();
    }

    throw new BadRequestError('Forbidden');
  }

  addMessage(userId: number, { chatId, content }: { chatId: number; content: string }): Promise<MessageEntity> {
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

      const msgs = await entityManager
        .createQueryBuilder(MessageEntity, 'M')
        .select('M.id', 'id')
        .addSelect('M.content', 'content')
        .addSelect('M.created_at', 'createdAt')
        .addSelect('U.id', 'senderId')
        .innerJoin('Users', 'U', 'U.id = M.ownerId')
        .where('M.id = :newMsgId', { newMsgId })
        .execute();

      return msgs[0];
    });
  }

  updateMessage(userId: number, { content, messageId }: { content?: string; messageId: number }) {
    const values = {
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

  async doReadMessage(userId: number, messageId: number) {
    const userAllowedToUpdate = await this.repository
      .createQueryBuilder('M')
      .select('U.id', 'senderId')
      .innerJoin('Chats', 'C', 'C.id = M.chatId')
      .innerJoin('UsersChats', 'UC', 'UC.chatsId = C.id')
      .innerJoin('Users', 'U', 'U.id = UC.usersId')
      .where('M.id = :messageId and U.id != :userId', { messageId, userId })
      .execute();

    if (userAllowedToUpdate.length === 0) {
      throw new ForbiddenError('Not allowed');
    }

    await this.repository
      .createQueryBuilder()
      .update()
      .set({ is_read: true })
      .where('id = :messageId', { messageId })
      .execute();

    return messageId;
  }
}
