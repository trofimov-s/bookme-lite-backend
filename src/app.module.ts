import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { BookingsModule } from './bookings';
import { ConfigModuleConfig, GlobalExceptionFilter } from './core';
import { PrismaModule } from './prisma';
import { ScheduleModule } from './schedule';
import { UsersModule } from './users';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigModuleConfig),
    PrismaModule,
    UsersModule,
    AuthModule,
    ScheduleModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class AppModule {}
