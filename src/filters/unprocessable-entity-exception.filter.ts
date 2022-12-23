import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: UnprocessableEntityException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception.getStatus();

    const errorResponse = exception.getResponse();

    if (typeof errorResponse === 'string') {
      httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
      return;
    }

    const errors = [];
    for (const error of errorResponse['message']) {
      for (const key in error.constraints) {
        errors.push({
          property: error.property,
          code: key,
          message: error.constraints[key],
        });
      }
    }

    const responseBody = {
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      errors: errors,
    };
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
