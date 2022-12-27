import { HttpException, HttpStatus } from '@nestjs/common';

export class RateLimitException extends HttpException {
  constructor() {
    super('error.rateLimit', HttpStatus.TOO_MANY_REQUESTS);
  }
}
