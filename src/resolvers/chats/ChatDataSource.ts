import { DataSource as ORMDataSource } from 'typeorm/data-source/DataSource';
import { ChatEntity } from 'entities/Chat.entity';
import { UserEntity } from 'entities/User.entity';
import { BadRequestError, ForbiddenError } from 'utils/errors';
import { FieldsByTypeName } from 'graphql-parse-resolve-info';
import { ONE_HOUR } from 'utils/date';

export default class ChatDataSource {
  constructor(private dbConnection: ORMDataSource) {}

  private get repository() {
    return this.dbConnection.getRepository(ChatEntity);
  }

  private get userRepository() {
    return this.dbConnection.getRepository(UserEntity);
  }

  private createChatIdsQueryForUser(userId: number) {
    return this.repository
      .createQueryBuilder('C')
      .select('C.id', 'id')
      .innerJoin('UsersChats', 'UC', 'UC.chatsId = C.id')
      .innerJoin('Users', 'U', 'U.id = UC.usersId')
      .where('U.id = :userId', { userId });
  }

  private getCorrespondentFromUser(user: UserEntity) {
    return {
      id: user.id,
      username: user.username
    };
  }

  getChats = async (userId: number) => {
    const chatIdsQuery = this.createChatIdsQueryForUser(userId);

    const chats = await this.repository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.users', 'user')
      .leftJoinAndSelect('c.messages', 'message')
      .where(`c.id IN (${chatIdsQuery.getQuery()})`)
      .setParameters(chatIdsQuery.getParameters())
      .cache(`getChats?userId=${userId}`, ONE_HOUR)
      .getMany();

    return chats.map(chat => ({
      ...chat,
      correspondent: chat.users.reduce(
        (acc, user) => (user.id !== userId ? this.getCorrespondentFromUser(user) : acc),
        {}
      )
    }));
  };

  async getUserThatTypingAtChat(userId: number, { chatId }: { chatId: number }) {
    return this.userRepository.findOne({
      where: { id: userId, chats: { id: chatId } },
      cache: {
        id: `getUserThatTypingAtChat?chatId=${chatId}&userId=${userId}`,
        milliseconds: ONE_HOUR
      },
      select: {
        id: true,
        username: true
      }
    });
  }

  getChatById = async (userId: number, { chatId }: { chatId: number }, include: FieldsByTypeName) => {
    const includeMessages = 'messages' in include && Boolean(include.messages);

    const chat = await this.repository.findOne({
      where: { id: chatId },
      relations: { messages: includeMessages, users: true },
      cache: {
        id: `getChatById?chatId=${chatId}`,
        milliseconds: ONE_HOUR
      }
    });

    if (chat.users.every(user => user.id !== userId)) {
      throw new ForbiddenError('Not allowed');
    }

    return {
      ...chat,
      correspondent: chat.users.reduce(
        (acc, user) => (user.id !== userId ? this.getCorrespondentFromUser(user) : acc),
        {}
      )
    };
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
            isGroup: false
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
