export interface DatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: string[];
  migrations: string[];
  keepConnectionAlive: boolean;
}

export interface AuthConfig {
  tokenTtl: number;
}

export interface Config {
  database: DatabaseConfig;
  auth: AuthConfig;
}

export const configuration = (): Config => ({
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'postgres',
    entities: [
      __dirname + '/../modules/**/*.entity{.ts,.js}',
      __dirname + '/../modules/**/*.view-entity{.ts,.js}',
    ],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    keepConnectionAlive: true,
  },
  auth: {
    tokenTtl: 60 * 60,
  },
});
