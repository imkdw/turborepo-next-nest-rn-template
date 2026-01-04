import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

import { APP_ENV, AppEnv, LOG_LEVEL, LogLevel } from './logger.const';
import { LokiTransport, LokiTransportOptions } from './transport';

const { combine, timestamp, ms, errors, splat, colorize, printf, json } = winston.format;

export interface LoggerConfigOptions {
  appName?: string;
  loki?: Omit<LokiTransportOptions, 'app'>;
}

function getAppEnv(): AppEnv {
  return (process.env.APP_ENV || process.env.NODE_ENV || APP_ENV.LOCAL) as AppEnv;
}

function localFormat(): winston.Logform.Format {
  return combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    ms(),
    errors({ stack: true }),
    splat(),
    colorize({ all: true }),
    printf(({ level, message, timestamp, ms, context, stack }) => {
      const contextStr = context ? `[${context}]` : '';
      const stackStr = stack ? `\n${stack}` : '';
      return `${timestamp} ${ms} ${level} ${contextStr} ${message}${stackStr}`;
    })
  );
}

function productionFormat(): winston.Logform.Format {
  return combine(timestamp(), ms(), errors({ stack: true }), splat(), json());
}

function getLogLevel(env: AppEnv): LogLevel {
  return env === APP_ENV.LOCAL ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO;
}

function getTransports(env: AppEnv, options?: LoggerConfigOptions): winston.transport[] {
  if (env === APP_ENV.TEST) {
    return [new winston.transports.Console({ silent: true })];
  }

  if (env === APP_ENV.LOCAL) {
    return [new winston.transports.Console({ format: localFormat() })];
  }

  if (options?.loki) {
    const appName = options.appName || 'app';
    const app = `${env}-${appName}`;

    return [
      new LokiTransport({
        ...options.loki,
        app,
      }),
    ];
  }

  return [new winston.transports.Console({ format: productionFormat() })];
}

export function createLoggerConfig(options?: LoggerConfigOptions): WinstonModuleOptions {
  const env = getAppEnv();

  return {
    level: getLogLevel(env),
    transports: getTransports(env, options),
  };
}

export const loggerConfig: WinstonModuleOptions = (() => {
  const env = getAppEnv();

  return {
    level: getLogLevel(env),
    transports: getTransports(env),
  };
})();
