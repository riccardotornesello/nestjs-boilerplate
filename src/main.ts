import {
  ClassSerializerInterceptor,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import helmet from 'helmet';

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

  app.use(helmet());

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

  await app.listen(3000);
}
bootstrap();
