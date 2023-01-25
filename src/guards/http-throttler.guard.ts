import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RateLimitException } from 'src/exceptions';

@Injectable()
export class HttpThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    return req.ips.length ? req.ips[0] : req.ip; // individualize IP extraction to meet your own needs
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected throwThrottlingException(context: ExecutionContext): void {
    throw new RateLimitException();
  }
}
