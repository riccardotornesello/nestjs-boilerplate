import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'postgres',
  entities: [
    'src/modules/**/*.entity{.ts,.js}',
    'src/modules/**/*.view-entity{.ts,.js}',
  ],
  migrations: ['src/database/migrations/*{.ts,.js}'],
});
