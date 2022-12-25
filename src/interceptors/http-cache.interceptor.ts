import {
  CACHE_KEY_METADATA,
  CacheInterceptor,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
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
