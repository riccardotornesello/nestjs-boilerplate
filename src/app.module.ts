import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './config';
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
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dbName: configService.get('postgres.database'),
        user: configService.get('postgres.username'),
        password: configService.get('postgres.password'),
        host: configService.get('postgres.host'),
        port: configService.get('postgres.port'),
        type: 'postgresql',
        autoLoadEntities: true,
      }),
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
