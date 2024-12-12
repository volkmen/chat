import { DataSource as ORMDataSource } from 'typeorm/data-source/DataSource';
import { ChatEntity } from 'entities/Chat.entity';
import { UserEntity } from 'entities/User.entity';
import { BadRequestError, ForbiddenError } from 'utils/errors';

export default class ChatDataSource {
  constructor(private dbConnection: ORMDataSource) {}

  private get repository() {
    return this.dbConnection.getRepository(ChatEntity);
  }

  private createChatIdsQueryForUser(userId: number) {
    return this.repository
      .createQueryBuilder('C')
      .select('C.id', 'id')
      .innerJoin('UsersChats', 'UC', 'UC.chatsId = C.id')
      .innerJoin('Users', 'U', 'U.id = UC.usersId')
      .where('U.id = :userId', { userId });
  }

  getChats = async (userId: number) => {
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
  };

  async selectChatIdWithUsername(userId: number, { chatId }: { chatId: number }) {
    const chats = await this.repository
      .createQueryBuilder('C')
      .select('C.id', 'id')
      .addSelect('U.username', 'username')
      .innerJoin('UsersChats', 'UC', 'UC.chatsId = C.id')
      .innerJoin('Users', 'U', 'U.id = UC.usersId')
      .where('U.id != :id and C.id = :chatId', { id: userId, chatId })
      .execute();

    return chats[0];
  }

  getChatById = async (userId: number, { chatId }: { chatId: number }, include: Record<string, boolean> = {}) => {
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

    if (!chat) {
      throw new ForbiddenError('not allowed');
    }

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

    try {
      const userA = await entityManager.findOne(UserEntity, { where: { id: userId } });
      const userB = await entityManager.findOne(UserEntity, { where: { id: receiverId } });

      if (!userA || !userB) {
        return new BadRequestError('Receiver or user is not exists');
      }

      const chatIdsQuery = this.createChatIdsQueryForUser(userId);

      const userChats = await entityManager
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
}
