/**
 * @fileoverview Middleware configuration for the Express application.
 * @version 1.0.0
 * @module appMiddleware
 */
import express, { Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

/**
 * Configure middlewares for the Express application.
 * @param {Application} app - The Express application instance.
 * @returns {void}
 */
export const configureMiddlewares = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === 'production'
          ? ['https://yourdomain.com']
          : ['*'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    })
  );
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    const stream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
      flags: 'a',
    });
    app.use(morgan('combined', { stream }));
  }
};
