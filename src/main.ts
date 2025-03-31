import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // config validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  // app's port
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  // config version api
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']
  });

  await app.listen(port);
}
bootstrap();
