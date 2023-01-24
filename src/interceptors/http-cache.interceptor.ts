import {
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
  CacheInterceptor,
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { isFunction, isNil } from '../utils/shared';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  // Like the original interceptor, fixed cacheManager.set args
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.trackBy(context);
    const ttlValueOrFactory =
      this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ?? null;

    if (!key) {
      return next.handle();
    }
    try {
      const value = await this.cacheManager.get(key);
      if (!isNil(value)) {
        return of(value);
      }
      const ttl = isFunction(ttlValueOrFactory)
        ? await ttlValueOrFactory(context)
        : ttlValueOrFactory;
      return next.handle().pipe(
        tap(async (response) => {
          const args = isNil(ttl) ? [key, response] : [key, response, ttl];

          try {
            await this.cacheManager.set(...args);
          } catch (err) {
            Logger.error(
              `An error has occured when inserting "key: ${key}", "value: ${response}"`,
              'CacheInterceptor',
            );
          }
        }),
      );
    } catch {
      return next.handle();
    }
  }

  protected trackBy(context: ExecutionContext): string | undefined {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;

    const cacheMetadata = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    const authenticationAware = this.reflector.get(
      'cache_module:authentication_aware',
      context.getHandler(),
    );

    if (!isHttpApp || cacheMetadata) {
      return cacheMetadata;
    }

    const request = context.getArgByIndex(0);
    if (!this.isRequestCacheable(context)) {
      return undefined;
    }

    const url = httpAdapter.getRequestUrl(request);
    if (authenticationAware === false) {
      return `cache:${url}`;
    } else if (request.user) {
      return `cache:${url}:${request.user.id}`;
    } else {
      return `cache:${url}:anonymous`;
    }
  }
}
