import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  // TODO: redis cluster
  _client: RedisClientType;

  constructor(private configService: ConfigService) {
    this._client = createClient({
      socket: {
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
      },
      password: configService.get('redis.password'),
    });
    this._client.connect();
  }

  get client(): RedisClientType {
    return this._client;
  }
}
