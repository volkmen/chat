import { DataSource } from 'typeorm';
import path from 'node:path';
import typeORMBseConfig from '../configs/typeorm-base.config';

const dataSourceConfig = new DataSource({
  ...typeORMBseConfig,
  // type: 'postgres',
  migrations: [path.join(process.cwd(), 'src/migrations')]
});

export default dataSourceConfig;
