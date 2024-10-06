/**
 * @fileoverview
 * @version 1.0.0
 * @module LoggerUtil
 */
import winston, { Logger, createLogger } from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { config } from '../configs/config';

type Environment = 'development' | 'production';

class LoggerUtil {
  private static instance: LoggerUtil;

  public static getInstance(): LoggerUtil {
    if (!LoggerUtil.instance) {
      LoggerUtil.instance = new LoggerUtil();
    }
    return LoggerUtil.instance;
  }

  public createLogger(): Logger {
    const environment: Environment =
      (process.env.NODE_ENV as Environment) || 'development';
    const transports =
      environment === 'development'
        ? new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
              winston.format.json(),
              winston.format.prettyPrint(),
            ),
          })
        : new LogtailTransport(new Logtail(config?.logging?.logtail));

    return createLogger({ transports });
  }
}

export const logger = LoggerUtil.getInstance().createLogger();
