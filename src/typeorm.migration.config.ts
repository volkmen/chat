import { DataSource } from 'typeorm';
import typeORMBseConfig from './configs/typeorm-base.config';

const dataSourceConfig = new DataSource(typeORMBseConfig);

export default dataSourceConfig;
