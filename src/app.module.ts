import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config, configuration } from './config';
import { AuthModule, UserModule } from './modules';
import { RedisCacheStore } from './services/redis-cache-store';
import { RedisThrottlerStoreService } from './services/redis-throttler-store';
import { RedisService } from './shared/services/redis.service';
import { SharedModule } from './shared/shared.module';

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
      useFactory: (redisService: RedisService) => ({
        store: new RedisCacheStore(redisService.client, {
          ttl: 100, // milliseconds
        }),
      }),
      inject: [RedisService],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (redisService: RedisService) => ({
        ttl: 60,
        limit: 10,
        storage: new RedisThrottlerStoreService(redisService.client),
      }),
      inject: [RedisService],
    }),
    SharedModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
