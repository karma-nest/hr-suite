/**
 * @fileoverview
 * @version 1.0.0
 * @module LoggerUtil
 */
import winston, { Logger, createLogger } from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { loggerConfig } from '../configs';

type Environment = 'development' | 'production';

type LoggerAccessToken = string;

/**
 * Singleton class responsible for initializing and providing access to logger instances.
 */
class LoggerUtil {
  private static instance: LoggerUtil;

  /**
   * Ensures a single instance of LoggerUtil is used throughout the application.
   * @returns {LoggerUtil} Instance of LoggerUtil.
   */
  public static getInstance(): LoggerUtil {
    if (!LoggerUtil.instance) {
      LoggerUtil.instance = new LoggerUtil();
    }
    return LoggerUtil.instance;
  }

  /**
   * Creates a Winston logger tailored to the application's current environment.
   * @param {LoggerAccessToken} accessToken - Unique access token for the logger.
   * @returns {Logger} Configured Winston logger instance.
   */
  public createLogger(accessToken: LoggerAccessToken): Logger {
    const environment: Environment =
      (process.env.NODE_ENV as Environment) || 'development';
    const transports =
      environment === 'development'
        ? new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
              winston.format.json(),
              winston.format.prettyPrint()
            ),
          })
        : new LogtailTransport(new Logtail(accessToken));

    return createLogger({ transports });
  }
}

export const logger = LoggerUtil.getInstance().createLogger(loggerConfig);
