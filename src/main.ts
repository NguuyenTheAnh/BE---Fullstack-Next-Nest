import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // config validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  // app's port
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  const reflector = app.get(Reflector);
  // config global guard
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // config transform interceptor
  app.useGlobalInterceptors(new TransformInterceptor(reflector));


  // config version api
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']
  });

  // config cors
  app.enableCors(
    {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    }
  );

  await app.listen(port);
}
bootstrap();
