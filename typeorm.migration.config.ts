import { DataSource } from 'typeorm';
import typeORMBseConfig from './src/configs/typeorm-base.config';

const dataSourceConfig = new DataSource(typeORMBseConfig);

export default dataSourceConfig;
