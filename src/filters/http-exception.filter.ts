import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception.getStatus();

    const errorResponse = exception.getResponse();
    const responseBody =
      typeof errorResponse === 'string'
        ? {
            error: errorResponse,
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
          }
        : {
            ...errorResponse,
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
          };

    // TODO: proper logging
    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.log('exception', exception);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
