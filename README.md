# NestJS Boilerplate

## Nice features

### Api Versioning

Using NestJS versioning feature (https://docs.nestjs.com/techniques/versioning).

The default version is `v1`.

Specify the controller version as in the following example:

```ts
@Controller({
  version: '1',
})
```

Or specify the version of the single method. Visit Nest's documentation for more information.

_Configuration in `app.init.ts`_

### Unique validator

The `Unique` validator allows you to check for duplicates in the database entries given a certain entity and reference column.

It needs the `shared/validation` module to work.

Example:

```ts
import { Unique } from '../../../shared/validation/validators/unique';

export class UserRegisterDto {
  @IsString()
  @MinLength(6)
  @Unique(User, 'username')
  readonly username: string;
}
```

### Sending emails

The `shared/mail` module allows to send emails using `nodemailer` (SMTP protocol).

Example:

```ts
import { MailService } from '../../shared/mail/mail.service';

@Injectable()
export class SomeService {
  constructor(private readonly mailService: MailService) {}

  async test(email) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Test email',
      text: 'Test text',
    });
  }
}
```

To use different services or protocols update the `sendEmail` function in the `shared/mail` module.

_TODO: Send in background_

### Redis

Use the `shared/redis` module to get a `redis` client.

This module is internally used by other modules (like caching and rate limiting).

Example:

```ts
import { RedisService } from './modules/shared/redis/redis.service';

const client = redisService.client;
```

### Caching

This boilerplate uses NestJS's `CacheModule` with a customized redis store (in `services/redis-cache-store.ts`) based on `node-cache-manager-redis-store`.

We chose to copy the file to allow for more customization, such as prefixing `cache` in the redis keys.

Also the cache interceptor is custom to make it authentication aware.

To automatically cache a response, use the custom `Cache` decorator with the following arguments:

- `ttl`: cache duration in milliseconds
- `authenticationAware`: if `true` the cache will be based on the user id, so different users will see different responses. Warning: all the unauthenticated users will use the same cache. if `false` all the requests will use the same cache.
- `key`: override the default cache key. The default value is the url of the request

Example:

```ts
import { Cache } from './decorators/cache.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Cache({ ttl: 500, authenticationAware: true })
  @Get()
  getUser(@Request() req) {
    return req.user;
  }
}
```

To interact directly with the Cache store, use the `cacheManager` as described in NestJS's documentation (https://docs.nestjs.com/techniques/caching#interacting-with-the-cache-store).

_TODO: function that executes a function if the cache is not set (get or set using function)_

### Rate limit

It is possible to use NestJS's `@nestjs/throttler` to limit the user's interactions using the custom `RateLimit` decorator from `decorators/rate-limit.decorator.ts`

The behaviour is the same as `Throttle` described in the documentation (https://docs.nestjs.com/security/rate-limiting) but it automatically inserts a custom `ThrottleGuard`.

The custom guard overrides the `getTracker` function to get the real IP address behind a reverse proxy. To update how to identify a user, just update the `getTracker` function in `guards/http-throttler.guard.ts`.

Also the `throwThrottlingException` has been overwritten to throw a custom exception.

Example:

```ts
import { RateLimit } from './decorators/rate-limit.decorator';

@Throttle(3, 60) // Max 3 requests every 60 seconds
@Get()
findAll() {
  return "List users works with custom rate limiting.";
}
```

### Configuration

The configuration is handled with NestJS's `ConfigModule`, initialized in `app.module`. It is global so every service can use the `ConfigService`.

In `config/index.ts` there are all the configuration interfaces and the config object with the default values.

### Validation and serialization

TODO: section missing

### Error handling

TODO: section missing

### Linting, formatting and pipeline

TODO: section missing

### Swagger

TODO: section missing

### Database connection

TODO: section missing

## Modules

### From NestJS

- ConfigModule
- MokroOrmModule
- CacheModule
- ThrottlerModule

### Shared

- RedisService
- MailService
- SharedService

### App modules

- Auth
- User

## Missing features

- Multiple authentication methods
- Logging
- Docker (with multi-stage build in production)
- Websockets
- Tests
- CORS
- CSRF
- Queue (Bull) with periodic tasks
- Compression
- Simple file upload
- File upload to MinIO/S3
- Microservices
- Two factor authentication
- Web vitals
