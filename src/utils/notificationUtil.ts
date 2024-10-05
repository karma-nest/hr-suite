/**
 * @fileoverview Utility class for sending notifications via email.
 * @version 1.0.0
 * @module NotificationUtil
 */
import { NotificationLib } from '../libs';
import { config } from '../configs/config';

export default class NotificationUtil {
  private readonly notificationLib: NotificationLib;

  constructor() {
    this.notificationLib = new NotificationLib();
  }

  public sendEmail = async (
    receiver: string,
    subject: string,
    template: string
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.notificationLib.createNodemailerTransport().sendMail(
        {
          from: `No-reply <${config?.mail?.nodemailer?.auth?.username}>`,
          to: receiver,
          subject,
          html: template,
        },
        (error: NodeJS.ErrnoException) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  };
}
