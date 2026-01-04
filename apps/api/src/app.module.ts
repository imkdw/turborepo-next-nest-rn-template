import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter, CustomExceptionFilter, loggerConfig, LoggingInterceptor } from '@repo/server-shared';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [WinstonModule.forRoot(loggerConfig)],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
