import path from 'node:path';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';

const typeORMBseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'wolf',
  database: process.env.DATABASE_NAME || 'vid',
  entities: [path.join(process.cwd(), 'src/entities/**/*.entity.ts')]
};

export default typeORMBseConfig;
