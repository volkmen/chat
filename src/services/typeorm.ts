import { DataSource } from 'typeorm';
import dataSourceConfig from '../configs/typeorm-base.config';

const dataSource = new DataSource({
  ...dataSourceConfig,
  type: 'postgres',
  logging: true,
  synchronize: true
});

export function connectToDatabase() {
  return dataSource.connect();
}
