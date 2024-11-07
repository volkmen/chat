import { DataSource as ORMDataSource } from 'typeorm';
import { UserEntity } from 'entities/User.entity';
import bcrypt from 'bcrypt';
import { promisify } from 'node:util';
import { BadRequestError, UnAuthorisedError } from 'utils/errors';
import { SignInInput } from './types';

const genSalt: (n: number) => Promise<string> = promisify(bcrypt.genSalt);
const genHash: (pass: string, salt: string) => Promise<string> = promisify(bcrypt.hash);
const comparePassword = promisify(bcrypt.compare);

export default class AccountDataSource {
  constructor(private dbConnection: ORMDataSource) {}

  private get repository() {
    return this.dbConnection.getRepository(UserEntity);
  }

  async getAccountById(id: number) {
    const account = await this.repository.findOneBy({ id });
    if (!account) {
      throw new UnAuthorisedError('Unauthorised');
    }
    return account;
  }

  getAccounts() {
    return this.repository.find();
  }

  async deleteAccount(id: number) {
    const account = await this.repository.findOneBy({ id });
    await this.repository.remove(account);
    return id;
  }

  async signIn({ email, password }: SignInInput): Promise<UserEntity> {
    const account = await this.repository.findOne({ where: { email } });

    if (!account) {
      throw new UnAuthorisedError('User or password invalid');
    }
    try {
      const result = await comparePassword(password, account.password);
      if (result) {
        return account;
      } else {
        throw new UnAuthorisedError('User or password invalid');
      }
    } catch (error) {
      throw new UnAuthorisedError('User or password invalid');
    }
  }

  async signUp(account: UserEntity) {
    const accountExistedAccounted = await this.repository.findBy({ email: account.email });
    if (!accountExistedAccounted) {
      throw new BadRequestError('Such account exist');
    }

    const email_token = Math.floor(Math.random() * 10000);
    const salt = await genSalt(5);
    account.password = await genHash(account.password, salt);
    account.email_token = email_token;

    await this.repository.insert(account);

    return account;
  }

  async updateAccount(id: number, changes: Partial<UserEntity>) {
    await this.repository.update({ id }, changes);
    return this.repository.findOneBy({ id });
  }

  async verifyEmail(id: number, token: number) {
    const account = await this.repository.findOneBy({ id });

    if (account && account.email_token === token) {
      await this.repository.update({ id }, { is_verified: true });
      return this.repository.findOneBy({ id });
    }
    throw new BadRequestError('wrong token');
  }
}
