import { AppController } from '@/app.controller';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  AllExceptionFilter,
  createLoggerConfig,
  CustomExceptionFilter,
  DatabaseModule,
  LoggingInterceptor,
  MyConfigModule,
  MyConfigService,
  TransformInterceptor,
} from '@repo/server-shared';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [
    MyConfigModule,
    DatabaseModule,
    UserModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: MyConfigService) => {
        return createLoggerConfig(configService.get('APP_ENV'));
      },
      inject: [MyConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
