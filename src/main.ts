import { NestFactory } from '@nestjs/core';
import { CONF } from './conf';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(CONF.API_PORT);
}
bootstrap();
