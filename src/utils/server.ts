/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv';
import http from 'http';
import ip from 'ip';
import os from 'os';
import { sequelize } from '../libs';
import { logger } from './';
import { Application } from 'express';

dotenv.config();

/**
 * Initialize and start the server.
 * @param {Application} app - The Express application instance.
 */
export const startServer = async (
  app: Application,
  port = 8080
): Promise<void> => {
  try {
    // Authenticate and sync database
    await sequelize.authenticate();
    await sequelize.sync({ force: false });

    // Start the server
    const server: http.Server = http.createServer(app);

    server.listen(port, () => {
      logger.info({
        serviceName: process.env.APP_NAME,
        host: `http://${ip.address()}:${port}`,
        platform: os.platform(),
      });
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }
      const bind = typeof port === 'string' ? `Pipe ${port}` : `port ${port}`;
      switch (error.code) {
        case 'EACCES':
          logger.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
  } catch (error: any) {
    logger.error('Failed to establish connection to database.', {
      error_name: error.constructor.name,
      error_message: `${error}`,
      error_stack: error.stack,
    });
    process.exit(1);
  }
};
