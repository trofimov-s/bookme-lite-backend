import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { configureAppBootstrap } from './core';
import { EnvKeys } from './shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  configureAppBootstrap(app, configService);

  const port = configService.getOrThrow<number>(EnvKeys.PORT);

  await app.listen(port);
}
void bootstrap();
