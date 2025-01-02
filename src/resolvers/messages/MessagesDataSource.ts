import { DataSource as ORMDataSource } from 'typeorm/data-source/DataSource';
import { ChatEntity } from 'entities/Chat.entity';
import { UserEntity } from 'entities/User.entity';
import { ForbiddenError } from 'utils/errors';
import { MessageEntity } from 'entities/Message.entity';
import { Paginated } from 'types/pagination';
import { get } from 'lodash';
import { type FieldsByTypeName } from 'graphql-parse-resolve-info';
import { ONE_HOUR, ONE_MINUTE } from 'utils/date';
import { createCacheTagsToRemove } from 'utils/typerom';

export default class MessagesDataSource {
  constructor(private dbConnection: ORMDataSource) {}

  private get repository() {
    return this.dbConnection.getRepository(MessageEntity);
  }

  async getMessageById(userId: number, id: number) {
    return this.repository.findOne({
      where: { id, owner: { id: userId } },
      relations: { chat: true },
      cache: {
        id: `getMessageById?id=${id}`,
        milliseconds: ONE_HOUR
      }
    });
  }

  async getMessages(
    userId: number,
    { chatId, page = 1, size = 30 }: { chatId: number; page?: number; size?: number },
    fieldsMap: FieldsByTypeName
  ): Promise<Paginated<MessageEntity>> {
    const ownerFields = get(fieldsMap, 'owner.fieldsByTypeName.User');

    const [messages, total] = await this.repository.findAndCount({
      where: { chat: { id: chatId, users: { id: userId } } },
      relations: {
        owner: Boolean(ownerFields)
      },
      select: {
        id: true,
        content: Boolean(fieldsMap['content']),
        createdAt: true,
        isRead: Boolean(fieldsMap['isRead']),
        owner: {
          id: Boolean(get(ownerFields, 'id')),
          username: Boolean(get(ownerFields, 'username'))
        }
      },
      order: {
        createdAt: 'DESC'
      },
      skip: size * (page - 1),
      take: size
    });

    return {
      total,
      page,
      size,
      data: messages.reverse()
    };
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

      return entityManager.findOne(MessageEntity, {
        where: { id: newMsgId },
        relations: {
          owner: true
        }
      });
    });
  }

  async updateMessage(userId: number, { content, messageId }: { content?: string; messageId: number }) {
    const values = {
      ...(content ? { content } : {})
    };
    const updateResult = await this.dbConnection
      .createQueryBuilder()
      .update(MessageEntity)
      .set(values)
      .where('id = :id', { id: messageId })
      .execute();

    this.dbConnection.queryResultCache.remove(createCacheTagsToRemove(`getMessageById?id=${messageId}`));
    return updateResult;
  }

  async deleteMessage(userId: number, messageId: number) {
    const message = await this.getMessageById(userId, messageId);

    await this.dbConnection
      .createQueryBuilder()
      .delete()
      .from(MessageEntity)
      .where('id = :id and ownerId = :userId', { id: messageId, userId })
      .execute();

    this.dbConnection.queryResultCache.remove(createCacheTagsToRemove(`getMessages?chatId=${message.chat.id}`));

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
      .set({ isRead: true })
      .where('id = :messageId', { messageId })
      .execute();

    return this.repository.findOne({ where: { id: messageId }, relations: { owner: true } });
  }
}
