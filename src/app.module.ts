import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config, configuration } from './config';
import { AuthModule, UserModule } from './modules';
import { UniqueRule } from './validators/unique';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<Config>) => {
        return configService.get('database');
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        ttl: 100, // 100 milliseconds
        store: (await redisStore({
          url: 'redis://localhost:6379',
        })) as unknown as CacheStore,
      }),
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UniqueRule],
})
export class AppModule {}
