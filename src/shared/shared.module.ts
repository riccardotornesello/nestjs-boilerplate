import { Global, Module } from '@nestjs/common';

import { MailService } from './services/mail.service';
import { RedisService } from './services/redis.service';
import { UniqueRule } from './validator-rules/unique-rule';

const providers = [RedisService, UniqueRule, MailService];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class SharedModule {}
