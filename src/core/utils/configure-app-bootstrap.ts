import type { INestApplication } from '@nestjs/common';
import { ClassSerializerInterceptor, HttpStatus, ValidationPipe } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppException } from '../exceptions';
import { getValidationErrorMessages } from './get-validation-error-messages';

import { EnvKeys, ErrorCode } from '@/shared';

export function configureAppBootstrap(app: INestApplication, configService: ConfigService): void {
  app.use(cookieParser());
  app.enableCors({
    origin: configService.getOrThrow<string>(EnvKeys.FRONTEND_URL),
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return new AppException(ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST, getValidationErrorMessages(errors));
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector), { excludeExtraneousValues: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('BookMe Lite API')
    .setDescription('BookMe Lite API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('documentation', app, document);
}
