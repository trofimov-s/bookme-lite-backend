import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { ConfigModuleConfig } from './core';
import { PrismaModule } from './prisma';
import { UsersModule } from './users';

@Module({
  imports: [ConfigModule.forRoot(ConfigModuleConfig), PrismaModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
