import * as dotenv from 'dotenv';
import { Options } from '@mikro-orm/core';

dotenv.config();

const config: Options = {
  type: 'postgresql',
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: parseInt(process.env.POSTGRES_PORT, 10),
  user: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  dbName: process.env.POSTGRES_NAME || 'postgres',
  entities: [
    'src/modules/**/*.entity{.ts,.js}',
    'src/modules/**/*.view-entity{.ts,.js}',
  ],
  migrations: { pathTs: 'src/database/migrations' },
};

export default config;
