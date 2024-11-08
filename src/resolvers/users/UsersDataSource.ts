import { DataSource as ORMDataSource } from 'typeorm';
import { UserEntity } from 'entities/User.entity';
import { UnAuthorisedError } from 'utils/errors';

export default class UsersDataSource {
  constructor(private dbConnection: ORMDataSource) {}

  private get repository() {
    return this.dbConnection.getRepository(UserEntity);
  }

  async getUserById(id: number) {
    const User = await this.repository.findOneBy({ id });
    if (!User) {
      throw new UnAuthorisedError('Unauthorised');
    }
    return User;
  }

  getUsers() {
    return this.repository.find();
  }

  async deleteUser(id: number) {
    const User = await this.repository.findOneBy({ id });
    await this.repository.remove(User);
    return id;
  }

  async updateUser(id: number, changes: Partial<UserEntity>) {
    await this.repository.update({ id }, changes);
    return this.repository.findOneBy({ id });
  }
}