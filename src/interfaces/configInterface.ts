/**
 * @fileoverview
 * @version
 * @module
 */

interface IAuth {
  argon: string;
  jwt: {
    access: string;
    activation: string;
    password: string;
  };
}

interface IDatabase {
  postgres: {
    name: string;
    host: string;
    password: string;
    username: string;
  };
  redis: string;
}

interface ILoggin {
  logtail: string;
}

interface IMail {
  mailgen: {
    name: string;
    link: string;
    logo: string;
    copyright: string;
  };
  nodemailer: {
    service: string;
    host: string;
    port: number;
    secure: boolean;
    auth: {
      username: string;
      password: string;
    };
  };
}

interface IStorage {
  cloudinary: {
    apiKey: string;
    secretKey: string;
    cloudName: string;
  };
}

interface IConfig {
  auth: IAuth;
  database: IDatabase;
  logging: ILoggin;
  mail: IMail;
  storage: IStorage;
}

export { IConfig };
