import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponse } from '@repo/types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { CustomException } from './custom.exception';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  catch(exception: CustomException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const { errorCode, message, statusCode } = exception;
    const { httpAdapter } = this.httpAdapterHost;

    const responseBody: ExceptionResponse = {
      statusCode,
      errorCode,
      message,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    this.logger.error(`CustomException: ${message}`, {
      ...responseBody,
      stack: exception.stack,
    });

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
