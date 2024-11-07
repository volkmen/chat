import { DataSource as ORMDataSource } from 'typeorm';
import { UserEntity } from 'entities/User.entity';
import bcrypt from 'bcrypt';
import { promisify } from 'node:util';
import { BadRequestError, UnAuthorisedError } from 'utils/errors';
import { SignInInput } from './types';

const genSalt: (n: number) => Promise<string> = promisify(bcrypt.genSalt);
const genHash: (pass: string, salt: string) => Promise<string> = promisify(bcrypt.hash);
const comparePassword = promisify(bcrypt.compare);

export default class AuthDataSource {
  constructor(private dbConnection: ORMDataSource) {}

  private get repository() {
    return this.dbConnection.getRepository(UserEntity);
  }

  async signIn({ email, password }: SignInInput): Promise<UserEntity> {
    const userEntity = await this.repository.findOne({ where: { email } });

    if (!userEntity) {
      throw new UnAuthorisedError('User or password invalid');
    }
    try {
      const result = await comparePassword(password, userEntity.password);
      if (result) {
        return userEntity;
      } else {
        throw new UnAuthorisedError('User or password invalid');
      }
    } catch (error) {
      throw new UnAuthorisedError('User or password invalid');
    }
  }

  async signUp(userEntity: UserEntity) {
    const existedUserEntity = await this.repository.findBy({ email: userEntity.email });
    if (!existedUserEntity) {
      throw new BadRequestError('Such user exist');
    }

    const email_token = Math.floor(Math.random() * 10000);
    const salt = await genSalt(5);
    userEntity.password = await genHash(userEntity.password, salt);
    userEntity.email_token = email_token;

    await this.repository.insert(userEntity);

    return userEntity;
  }

  async verifyEmail(id: number, token: number) {
    const userEntity = await this.repository.findOneBy({ id });

    if (userEntity && userEntity.email_token === token) {
      await this.repository.update({ id }, { is_verified: true });
      return this.repository.findOneBy({ id });
    }
    throw new BadRequestError('wrong token');
  }

  async updateEmailToken(id: number) {
    const email_token = Math.floor(Math.random() * 10000);
    await this.repository.update({ id }, { email_token });

    return this.repository.findOneBy({ id });
  }
}
