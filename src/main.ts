/**
 * @fileoverview Express application setup and configuration with request logging.
 * @version 1.0.0
 * @module appConfig
 */
import express, { Application } from 'express';
import { appMiddleware } from './middlewares';
import { startServer } from './utils';

import dotenv from 'dotenv';
dotenv.config();

const PORT: string = process.env.PORT ?? '3000';

/**
 * The Express application instance.
 * @type {Application}
 */
const app: Application = express();

appMiddleware(app);

startServer(app, parseInt(PORT, 10));
