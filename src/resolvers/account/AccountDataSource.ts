import { DataSource as ORMDataSource } from 'typeorm';
import { AccountEntity } from 'entities/Account.entity';
import bcrypt from 'bcrypt';
import { promisify } from 'node:util';

const genSalt = promisify(bcrypt.genSalt);
const genHash = promisify(bcrypt.hash);

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

  async addAccount(account: AccountEntity) {
    const emailToken = Math.floor(Math.random() * 10000);
    const salt = await bcrypt.genSalt(5);
    account.password = await bcrypt.hash(account.password, salt);
    account.emailToken = emailToken;

    await this.repository.insert(account);

    return account;
  }

  async updateAccount(id: number, changes: Partial<AccountEntity>) {
    await this.repository.update({ id }, changes);
    return this.repository.findOneBy({ id });
  }

  async verifyEmail(id: number) {
    await this.repository.update({ id }, { is_verified: true });
    return this.repository.findOneBy({ id });
  }
}
