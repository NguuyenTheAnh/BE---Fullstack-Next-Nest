import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // config validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  // app's port
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  // config global guard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // config version api
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']
  });

  await app.listen(port);
}
bootstrap();
