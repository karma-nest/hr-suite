/**
 * @fileoverview
 * @version
 * @module
 */
import { IConfig } from '../interfaces';

export const config: IConfig = {
  auth: {
    argon: process.env.ARGON2_PEPPER_KEY || '',
    jwt: {
      access: process.env.JWT_ACCESS_KEY || '',
      activation: process.env.JWT_ACTIVATION_KEY || '',
      password: process.env.JWT_PASSWORD_KEY || '',
    },
  },
  database: {
    postgres: {
      name: process.env.POSTGRES_DATABASE_NAME || '',
      host: process.env.POSTGRES_HOST || '',
      password: process.env.POSTGRES_PASSWORD || '',
      username: process.env.POSTGRES_USERNAME || '',
    },
    redis: process.env.REDIS_URI || '',
  },
  logging: {
    logtail: process.env.LOGTAIL_ACCESS_TOKEN || '',
  },
  mail: {
    mailgen: {
      name: process.env.MAILGEN_NAME || '',
      link: process.env.MAILGEN_LINK || '',
      logo: process.env.MAILGEN_IMAGE || '',
      copyright: process.env.MAILGEN_COPYRIGHT || '',
    },
    nodemailer: {
      service: process.env.NODEMAILER_SERVICE || '',
      host: process.env.NODEMAILER_HOST || '',
      port: parseInt(process.env.NODEMAILER_PORT) || 465,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      auth: {
        username: process.env.NODEMAILER_USERNAME || '',
        password: process.env.NODEMAILER_PASSWORD || '',
      },
    },
  },
  storage: {
    cloudinary: {
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      secretKey: process.env.CLOUDINARY_SECRET_KEY || '',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    },
  },
};
