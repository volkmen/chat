import { DataSource } from 'typeorm';
import * as path from 'node:path';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'wolf',
  database: 'vid',
  logging: true,
  entities: [path.join(__dirname, 'entities/**/*.entity.ts')]
});

export function connectToDatabase() {
  return dataSource.connect();
}
