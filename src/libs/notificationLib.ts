/**
 * @fileoverview
 * @module
 * @version
 */
import nodemailer, { Transporter } from 'nodemailer';
import mailGen from 'mailgen';
import { config } from '../configs/config';

export default class NotificationLib {
  constructor() {
    //
  }

  /**
   * Gets the mailgen instance.
   * @returns {mailGen} The mailgen instance.
   */
  public getMailgenInstance = (theme: string): mailGen => {
    return new mailGen({
      theme,
      product: {
        name: config?.mail?.mailgen?.name,
        link: config?.mail?.mailgen?.link,
        logo: config?.mail?.mailgen?.logo,
        copyright: config?.mail?.mailgen?.copyright,
      },
    });
  };

  /**
   * Creates a Nodemailer transport instance with the configuration provided.
   * @returns {Transporter} Nodemailer transport instance.
   */
  public createNodemailerTransport(): Transporter {
    return nodemailer.createTransport({
      host: config?.mail?.nodemailer?.host,
      port: config?.mail?.nodemailer?.port,
      secure: config?.mail?.nodemailer?.secure,
      auth: {
        user: config?.mail?.nodemailer?.auth?.username,
        pass: config?.mail?.nodemailer?.auth?.password,
      },
    });
  }
}
