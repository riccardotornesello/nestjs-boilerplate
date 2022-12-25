import { Global, Module } from '@nestjs/common';

import { RedisService } from './services/redis.service';
import { UniqueRule } from './validator-rules/unique-rule';

const providers = [RedisService, UniqueRule];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class SharedModule {}
