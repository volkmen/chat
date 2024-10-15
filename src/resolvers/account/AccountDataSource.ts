import { DataSource as ORMDataSource } from 'typeorm';
import { AccountEntity } from 'entities/Account.entity';

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
    await this.repository.insert(account);
    return account;
  }

  async updateAccount(id: number, changes: Partial<AccountEntity>) {
    await this.repository.update({ id }, changes);
    return this.repository.findOneBy({ id });
  }
}
