import {
  ClassSerializerInterceptor,
  INestApplication,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { configuration } from './config';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  UnprocessableEntityExceptionFilter,
} from './filters';

export function initApp(app: INestApplication) {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const httpAdapter = app.get(HttpAdapterHost);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: configuration().security.corsHosts,
  });

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

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS project')
    .setDescription('A simple NestJS boilerplate')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
}
