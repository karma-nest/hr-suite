/**
 * @fileoverview
 * @module
 * @version
 */
import { LoggerConfig } from '../types';

export const loggerConfig: LoggerConfig = process.env['LOGTAIL_SYSTEM_TOKEN'] || null;
