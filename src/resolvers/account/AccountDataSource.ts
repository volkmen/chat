import { DataSource as ORMDataSource } from 'typeorm';
import { AccountEntity } from 'entities/Account.entity';
import bcrypt from 'bcrypt';
import { promisify } from 'node:util';
import { BadRequestError, UnAuthorisedError } from 'utils/errors';
import { SignInInput } from './types';

const genSalt = promisify(bcrypt.genSalt);
const genHash = promisify(bcrypt.hash);
const comparePassword = promisify(bcrypt.compare);

export default class AccountDataSource {
  constructor(private dbConnection: ORMDataSource) {}

  private get repository() {
    return this.dbConnection.getRepository(AccountEntity);
  }

  getAccountById(id: number) {
    return this.repository.findOneBy({ id });
  }

  getAccounts() {
    return this.repository.find();
  }

  async deleteAccount(id: number) {
    const account = await this.repository.findOneBy({ id });
    await this.repository.remove(account);
    return id;
  }

  async signIn({ email, password }: SignInInput): Promise<AccountEntity> {
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

  async addAccount(account: AccountEntity) {
    const emailToken = Math.floor(Math.random() * 10000);
    const salt = await genSalt(5);
    account.password = await genHash(account.password, salt);
    account.emailToken = emailToken;

    await this.repository.insert(account);

    return account;
  }

  async updateAccount(id: number, changes: Partial<AccountEntity>) {
    await this.repository.update({ id }, changes);
    return this.repository.findOneBy({ id });
  }

  async verifyEmail(id: number, token: number) {
    const account = await this.repository.findOneBy({ id });
    if (account && account.emailToken === token) {
      await this.repository.update({ id }, { is_verified: true });
      return this.repository.findOneBy({ id });
    }
    throw new BadRequestError('wrong token');
  }
}
