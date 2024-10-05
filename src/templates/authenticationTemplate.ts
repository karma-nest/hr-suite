/**
 * @fileoverview
 * @module
 * @version
 */
import { config } from '../configs/config';
import { NotificationLib } from '../libs';

class AuthenticationTemplate {
  private static instance: AuthenticationTemplate;

  constructor(
    private readonly notificationUtil: NotificationLib = new NotificationLib()
  ) {}

  public static getInstance(): AuthenticationTemplate {
    if (!AuthenticationTemplate.instance) {
      AuthenticationTemplate.instance = new AuthenticationTemplate();
    }
    return AuthenticationTemplate.instance;
  }

  public setUpPassword = (email: string, password_token: string): string => {
    const password_setup_uri = `${
      process.env.CLIENT_URI
    }/auth/set-password?token=${encodeURIComponent(password_token)}`;

    return this.notificationUtil.getMailgenInstance('salted').generate({
      body: {
        title: 'Set up your password',
        intro: `You just signed up for a new ${config?.mail?.mailgen?.name} account with the username: ${email}.`,
        action: {
          instructions:
            'Please click on the button below within the next 15 minutes to set up your password.',
          button: {
            text: 'Set up password',
            color: '#28214c',
            link: password_setup_uri,
          },
        },
        outro: `Having troubles? Copy this link into your browser instead: ${password_setup_uri}`,
      },
    });
  };

  public activateAccount = (
    email: string,
    activation_token: string
  ): string => {
    const activation_uri = `${
      process.env.API_URI
    }/api/v1/auth/activate?token=${encodeURIComponent(activation_token)}`;

    return this.notificationUtil.getMailgenInstance('salted').generate({
      body: {
        title: 'Activate your account',
        intro: `We noticed your ${config?.mail?.mailgen?.name} account for username ${email} is currently inactive.`,
        action: {
          instructions:
            'To activate your account, click on the button below within the next 15 minutes.',
          button: {
            text: 'Activate Account',
            color: '#28214c',
            link: activation_uri,
          },
        },
        outro: `Having troubles? Copy this link into your browser instead: ${activation_uri}`,
      },
    });
  };

  public forgotPassword = (email: string, password_token: string): string => {
    const password_reset_uri = `${
      process.env.CLIENT_URI
    }/auth/reset-password?token=${encodeURIComponent(password_token)}`;

    return this.notificationUtil.getMailgenInstance('salted').generate({
      body: {
        title: `Hello, ${email}.`,
        intro: 'Someone has requested a link to change your password.',
        action: {
          instructions:
            'To reset your password, click the button below within the next 30 minutes. If you ignore this message, your password will not be changed.',
          button: {
            text: 'Reset Password',
            color: '#28214c',
            link: password_reset_uri,
          },
        },
        outro: `Having troubles? Copy this link into your browser instead: ${password_reset_uri}`,
      },
    });
  };

  public passwordUpdate = (
    email: string,
    device: {
      ip: string;
      timestamp: string;
    }
  ): string => {
    return this.notificationUtil.getMailgenInstance('salted').generate({
      body: {
        title: `Hi, ${email}.`,
        intro: `Your ${config?.mail?.mailgen?.name} account password has been successfully updated.`,
        table: {
          data: [
            { item: 'IP', description: device.ip },
            { item: 'Timestamp', description: device.timestamp },
          ],
          columns: {
            customWidth: {
              item: '20%',
              description: '80%',
            },
            customAlignment: {
              item: 'left',
              description: 'left',
            },
          },
        },
        outro: `If you did not make this change or need further assistance, please contact our support team at support@${config?.mail?.mailgen?.link}.`,
      },
    });
  };
}

export const authenticationTemplate = AuthenticationTemplate.getInstance();
