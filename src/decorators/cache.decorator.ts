import {
  applyDecorators,
  CacheKey,
  CacheTTL,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';

import { HttpCacheInterceptor } from '../interceptors';

export type CacheOptions = {
  ttl?: number;
  authenticationAware?: boolean;
  key?: string;
};

export function Cache({
  ttl,
  authenticationAware,
  key,
}: CacheOptions = {}): MethodDecorator {
  const decorators = [UseInterceptors(HttpCacheInterceptor)];

  if (authenticationAware) {
    decorators.push(
      SetMetadata('cache_module:authentication_aware', authenticationAware),
    );
  }
  if (ttl) {
    decorators.push(CacheTTL(ttl));
  }
  if (key) {
    decorators.push(CacheKey(`cache:${key}`));
  }

  return applyDecorators(...decorators);
}
