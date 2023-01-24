import { Global, Module } from '@nestjs/common';

import { UniqueRule } from './validator-rules/unique-rule';

@Global()
@Module({
  providers: [UniqueRule],
  exports: [UniqueRule],
})
export class ValidationModule {}
