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
    return this.repository.remove(account);
  }

  addAccount(account: AccountEntity) {
    console.log(account);
    return this.repository.insert(account);
  }

  updateAccount(id: number, changes: Partial<AccountEntity>) {
    return this.repository.update({ id }, changes);
  }
}
