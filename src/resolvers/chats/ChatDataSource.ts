import { DataSource as ORMDataSource } from 'typeorm/data-source/DataSource';
import { ChatEntity } from 'entities/Chat.entity';
import { UserEntity } from 'entities/User.entity';
import { PublicKeyEntity } from '../../entities/PublicKey.entity';
import { BadRequestError } from '../../utils/errors';

export default class ChatDataSource {
  constructor(private dbConnection: ORMDataSource) {}

  private get repository() {
    return this.dbConnection.getRepository(ChatEntity);
  }

  private get usersRepository() {
    return this.dbConnection.getRepository(UserEntity);
  }

  private get userRepository() {
    return this.dbConnection.getRepository(UserEntity);
  }

  getChats = async (userId: number) => {
    return this.repository.find({
      relations: {
        users: true
      },
      where: {
        users: {
          id: userId
        }
      }
    });
  };

  getChatPbKeys = async (userId: number, chatId: number) => {
    const pbKeyEntity = await this.dbConnection.getRepository(PublicKeyEntity).findOne({
      where: {
        chat: {
          id: chatId
        },
        user: {
          id: userId
        }
      },
      select: {
        publicKey: true
      }
    });

    return pbKeyEntity.publicKey;
  };

  async addChat(userId: number, { pbKey, receiverId }: { pbKey: string; receiverId: number }) {
    return this.dbConnection.transaction(async entityManager => {
      const chats = await entityManager
        .createQueryBuilder(ChatEntity, 'chat')
        .innerJoinAndSelect('UsersChats', 'UC', 'UC.usersId IN (:...userIds)', { userIds: [userId, receiverId] })
        .getMany();

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
        .values({
          is_group: false
        })
        .execute();

      const newChatId = chatInsertResult.identifiers[0].id;

      const newChat = await entityManager
        .createQueryBuilder(ChatEntity, 'c')
        .where('c.id = :newChatId', { newChatId })
        .getOne();

      const pbKeyInsertResult = await entityManager
        .createQueryBuilder()
        .insert()
        .into(PublicKeyEntity) // The table name, as defined in your entity
        .values({
          publicKey: pbKey
        })
        .execute();

      const pbKeyEntity = await entityManager
        .createQueryBuilder(PublicKeyEntity, 'pb')
        .where('pb.id = :pbKey', { pbKey: pbKeyInsertResult.identifiers[0].id })
        .getOne();

      await entityManager.createQueryBuilder().relation(PublicKeyEntity, 'chat').of(pbKeyEntity).set(newChat);
      await entityManager.createQueryBuilder().relation(UserEntity, 'chats').of(userA).add(newChat);
      await entityManager.createQueryBuilder().relation(UserEntity, 'chats').of(userB).add(newChat);

      return newChatId;
    });
  }
}
