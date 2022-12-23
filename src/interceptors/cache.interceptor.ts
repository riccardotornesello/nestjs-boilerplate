import { Inject, Injectable, Optional } from '@nestjs/common';
import {
  CallHandler,
  ExecutionContext,
  HttpServer,
  NestInterceptor,
} from '@nestjs/common';
import {
  CACHE_KEY_METADATA,
  CACHE_MANAGER,
  CACHE_TTL_METADATA,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { isFunction, isNil } from '../common/utils';

const HTTP_ADAPTER_HOST = 'HttpAdapterHost';
const REFLECTOR = 'Reflector';

export interface HttpAdapterHost<T extends HttpServer = any> {
  httpAdapter: T;
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  @Optional()
  @Inject(HTTP_ADAPTER_HOST)
  protected readonly httpAdapterHost: HttpAdapterHost;

  protected allowedMethods = ['GET'];
  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager: any,
    @Inject(REFLECTOR) protected readonly reflector: any,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.trackBy(context);
    const ttlValueOrFactory =
      this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ?? null;

    console.log(key);

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
          const args = isNil(ttl) ? [key, response] : [key, response, { ttl }];

          try {
            await this.cacheManager.set(...args);
          } catch (err) {
            console.log(
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

    if (!isHttpApp || cacheMetadata) {
      return cacheMetadata;
    }

    const request = context.switchToHttp().getRequest();
    if (!this.isRequestCacheable(context)) {
      return undefined;
    }

    const url = httpAdapter.getRequestUrl(request);
    if (request.user) {
      return `${url}:${request.user.id}`;
    }
    return url;
  }

  protected isRequestCacheable(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return this.allowedMethods.includes(req.method);
  }
}
