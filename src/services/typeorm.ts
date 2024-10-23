import { DataSource } from 'typeorm';
import dataSourceConfig from '../configs/typeorm-base.config';
import { getIsDevelopment } from '../utils/env';

const isDevelopment = getIsDevelopment();
export function connectToDatabase(dataSourceOptions = {}) {
  const dataSource = new DataSource({
    ...dataSourceConfig,
    logging: isDevelopment,
    // synchronize: isDevelopment,
    // dropSchema: false,
    ...dataSourceOptions
  });
  return dataSource.connect();
}
