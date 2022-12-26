import { NestFactory } from '@nestjs/core';

import { initApp } from './app.init';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initApp(app);

  await app.listen(3000);
}
bootstrap();
