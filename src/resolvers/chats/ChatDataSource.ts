import { DataSource as ORMDataSource } from 'typeorm/data-source/DataSource';
import { ChatEntity } from 'entities/Chat.entity';
import { UserEntity } from 'entities/User.entity';
import { PublicKeyEntity } from '../../entities/PublicKey.entity';

export default class ChatDataSource {
  constructor(private dbConnection: ORMDataSource) {}

  private get repository() {
    return this.dbConnection.getRepository(ChatEntity);
  }

  private get userRepository() {
    return this.dbConnection.getRepository(UserEntity);
  }

  getChats = async (userId: number) => {
    const chats = await this.repository.find({
      relations: {
        users: true
      },
      where: {
        users: {
          id: userId
        }
      }
    });

    return chats;
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
}
