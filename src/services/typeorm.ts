import { DataSource } from 'typeorm';
import dataSourceConfig from '../configs/typeorm-base.config';
import { getIsDevelopment } from '../utils/env';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';

const isDevelopment = getIsDevelopment();
export function connectToDatabase(dataSourceOptions = {}) {
  const options: DataSourceOptions = Object.assign(
    {
      logging: isDevelopment,
      ...dataSourceOptions
    },
    dataSourceConfig
  );

  const dataSource = new DataSource(options);

  return dataSource.connect();
}
