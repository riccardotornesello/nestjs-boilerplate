import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import {
  ValidationPipe,
  ValidationError,
  UnprocessableEntityException,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  UnprocessableEntityExceptionFilter,
} from './filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) =>
        new UnprocessableEntityException(errors),
    }),
  );

  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter),
    new HttpExceptionFilter(httpAdapter),
    new UnprocessableEntityExceptionFilter(httpAdapter),
  );

  await app.listen(3000);
}
bootstrap();
