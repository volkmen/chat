import { DataSource as ORMDataSource, Not } from 'typeorm';
import { UserEntity } from 'entities/User.entity';
import { UnAuthorisedError } from 'utils/errors';
import { FieldsByTypeName } from 'graphql-parse-resolve-info';
import { ONE_HOUR } from 'utils/date';
import { createCacheTagsToRemove } from 'utils/typerom';

export default class UsersDataSource {
  constructor(private dbConnection: ORMDataSource) {}

  private get repository() {
    return this.dbConnection.getRepository(UserEntity);
  }

  async getUserById(id: number, fieldsMap: FieldsByTypeName) {
    const User = await this.repository.findOne({
      where: { id },
      relations: { chats: Boolean(fieldsMap['chats']) },
      cache: {
        id: `getUserById_${id}`,
        milliseconds: ONE_HOUR
      }
    });

    if (!User) {
      throw new UnAuthorisedError('Unauthorised');
    }
    return User;
  }

  getUsers(userId: number, fieldsMap: FieldsByTypeName) {
    return this.repository.find({
      relations: {
        chats: {
          messages: true
        }
      },
      where: {
        id: Not(userId)
      }
    });
  }

  async deleteUser(id: number) {
    const User = await this.repository.findOneBy({ id });
    await this.repository.remove(User);
    return id;
  }

  async updateUser(id: number, changes: Partial<UserEntity>) {
    await this.repository.update({ id }, changes);
    this.dbConnection.queryResultCache.remove(createCacheTagsToRemove(`getUserById_${id}`));
    return this.repository.findOneBy({ id });
  }
}
