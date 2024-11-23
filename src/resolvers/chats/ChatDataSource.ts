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

  private get userRepository() {
    return this.dbConnection.getRepository(UserEntity);
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

  getChatById = async (userId: number, chatId: number) => {
    const chats = await this.repository
      .createQueryBuilder('C')
      .select('C.id', 'id')
      .addSelect("json_build_object('id', U.id, 'username', U.username)", 'correspondent')
      .innerJoin('UsersChats', 'UC', 'UC.chatsId = C.id')
      .innerJoin('Users', 'U', 'U.id = UC.usersId')
      .where('U.id != :id and C.id = :chatId', { id: userId, chatId })
      .execute();

    return chats[0];
  };

  async addChat(userId: number, { receiverId }: { receiverId: number }) {
    const queryRunner = this.dbConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const entityManager = queryRunner.manager;

    try {
      const chats = await this.repository
        .createQueryBuilder('C')
        .select('C.id', 'id')
        .addSelect('U.id', 'receiverId')
        .innerJoin('UsersChats', 'UC', 'UC.chatsId = C.id')
        .innerJoin('Users', 'U', 'U.id = UC.usersId')
        .where('U.id != :id and U.id = :receiverId', { id: userId, receiverId })
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

      const user = await entityManager.createQueryBuilder(UserEntity, 'user').where('user.id = :userId', { userId });
      const chat = await entityManager.createQueryBuilder(ChatEntity, 'chat').where('chat.id = :chatId', { chatId });

      await entityManager.createQueryBuilder().relation(MessageEntity, 'owner').of(newMsg).add(user);
      await entityManager.createQueryBuilder().relation(ChatEntity, 'chat').of(newMsg).add(chat);
    });
  }

  deleteMessage(userId: number, messageId: number) {
    return this.dbConnection
      .createQueryBuilder()
      .delete()
      .from(MessageEntity)
      .where('id = :id and ownerId = :userId', { id: messageId, userId })
      .execute();
  }
}
