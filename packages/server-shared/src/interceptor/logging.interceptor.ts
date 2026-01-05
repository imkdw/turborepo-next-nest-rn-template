import { CallHandler, ExecutionContext, HttpStatus, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Logger } from 'winston';

import { MyConfigService } from '../config';
import { APP_ENV, AppEnv, LOG_LEVEL, LogLevel } from '../logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly env: AppEnv;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: MyConfigService
  ) {
    this.env = this.configService.get('APP_ENV');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url, body } = request;
    const startTime = Date.now();
    const requestContext = `${method} ${url}`;

    if (this.env === APP_ENV.LOCAL) {
      this.logger.debug(`Request started`, {
        context: requestContext,
        body,
      });
    }

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode;

        this.logger.log(this.getLogLevel(statusCode), `Request completed`, {
          context: requestContext,
          statusCode,
          responseTime: `${responseTime}ms`,
        });
      }),
      catchError((error: Error) => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode >= 400 ? response.statusCode : 500;

        this.logger.error(`Request failed`, {
          context: requestContext,
          statusCode,
          responseTime: `${responseTime}ms`,
          error: error.message,
          stack: error.stack,
        });

        return throwError(() => error);
      })
    );
  }

  private getLogLevel(statusCode: number): LogLevel {
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      return LOG_LEVEL.ERROR;
    }

    if (statusCode >= HttpStatus.BAD_REQUEST) {
      return LOG_LEVEL.WARN;
    }

    return LOG_LEVEL.INFO;
  }
}
