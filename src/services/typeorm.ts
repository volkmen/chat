import { DataSource } from 'typeorm';
import dataSourceConfig from '../configs/typeorm-base.config';

const isDevelopment = process.env.NODE_ENV === 'development';
export function connectToDatabase(dataSourceOptions = {}) {
  const dataSource = new DataSource({
    ...dataSourceConfig,
    logging: isDevelopment,
    synchronize: isDevelopment,
    ...dataSourceOptions
  });
  return dataSource.connect();
}
