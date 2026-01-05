import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponse } from '@repo/types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { MyConfigService } from '../config';
import { APP_ENV, AppEnv } from '../logger';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly env: AppEnv;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: MyConfigService
  ) {
    this.env = this.configService.get('APP_ENV');
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const isHttpException = exception instanceof HttpException;

    const httpStatus = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException
      ? (exception.getResponse() as ExceptionResponse)
      : ({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorCode: 'INTERNAL_SERVER_ERROR',
          message: 'Internal Server Error',
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
          stack: (exception as Error).stack ?? '',
        } satisfies ExceptionResponse);

    const responseBody: ExceptionResponse = {
      statusCode: httpStatus,
      errorCode: exceptionResponse.errorCode || 'UNKNOWN_ERROR',
      message: exceptionResponse.message,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      stack: this.env === APP_ENV.LOCAL ? exceptionResponse.stack : undefined,
    };

    this.logger.error('Exception occurred', {
      ...responseBody,
      originalStack: (exception as Error).stack,
    });

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
