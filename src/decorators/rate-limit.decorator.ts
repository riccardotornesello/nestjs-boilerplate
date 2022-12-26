import { applyDecorators, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { HttpThrottlerGuard } from '../guards/http-throttler.guard';

export function RateLimit(limit?: number, ttl?: number): MethodDecorator {
  return applyDecorators(Throttle(limit, ttl), UseGuards(HttpThrottlerGuard));
}
