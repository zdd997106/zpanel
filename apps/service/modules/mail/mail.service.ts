import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async sendApplicationApproval(
    email: string,
    args: { name: string; password: string },
  ) {
    const { name, password } = args;
    const url = this.adminUrl('/sign-in', {
      with: encodeBase64(JSON.stringify({ account: email, password })),
    });

    await this.sendMail(email, {
      subject: 'ZPanel: Application Approved',
      template: './application-approval',
      context: { email, url, name, password },
    });
  }

  async sendApplicationRejection(
    email: string,
    args: { name: string; reason: string },
  ) {
    const { name, reason } = args;
    await this.sendMail(email, {
      subject: 'ZPanel: Application Rejected',
      template: './application-rejection',
      context: { name, reason },
    });
  }

  async sendUpdateUserEmailConfirmation(
    email: string,
    args: { name: string; newEmail: string; token: string },
  ) {
    const { name, newEmail, token } = args;
    const user = this.request.signedInInfo.userId;
    const url = this.adminUrl('/update-email', { user, token: token });
    const supportEmail = this.configService.getOrThrow('MAIL_ACCOUNT');

    await this.sendMail(email, {
      subject: 'ZPanel: Update Email Confirmation',
      template: './update-email-confirmation',
      context: { name, newEmail, url, supportEmail },
    });
  }

  async sendNotificationUpdate(
    email: string,
    args: { name: string; title: string; message: string; link: string | null },
  ) {
    const { name, title, link } = args;
    const url = this.adminUrl('/account/notification');
    const message = formatMessage(args.message, link && this.adminUrl(link));

    await this.sendMail(email, {
      subject: 'ZPanel: You have a new notification',
      template: './notification-update',
      context: { url, name, title, message },
    });

    function formatMessage(message: string, url: string | null) {
      if (!url) return message;
      return message.replace(/<a>([^]+)<\/a>/, `<a href=${url}>$1</a>`);
    }
  }

  async sendPasswordResetEmail(
    email: string,
    args: { name: string; token: string },
  ) {
    const { name, token } = args;
    const url = this.adminUrl('/reset-password', { token });
    await this.sendMail(email, {
      subject: 'ZPanel: Password Reset',
      template: './password-reset',
      context: { name, url },
    });
  }

  async sendUserDeletedNotify(
    email: string,
    args: { name: string; account: string },
  ) {
    const { name, account } = args;
    const supportEmail = this.configService.getOrThrow('MAIL_ACCOUNT');

    await this.sendMail(email, {
      subject: 'ZPanel: Your account has been deleted',
      template: './user-deleted-notify',
      context: { name, account, supportEmail },
    });
  }

  async sendUserEmailUpdateNotify(
    email: string,
    args: { name: string; oldEmail: string; newEmail: string },
  ) {
    const { name, oldEmail, newEmail } = args;
    const supportEmail = this.configService.getOrThrow('MAIL_ACCOUNT');

    await this.sendMail(email, {
      subject: 'ZPanel: Notification of an email change',
      template: './user-email-update-notify',
      context: { name, oldEmail, newEmail, supportEmail },
    });
  }

  // --- PRIVATES ---

  private sendMail(target: string, options: Omit<ISendMailOptions, 'to'>) {
    const from =
      options.from ||
      `"ZPanel" <${this.configService.getOrThrow('MAIL_ACCOUNT')}>`;

    return this.mailerService.sendMail({
      ...options,
      to: this.to(target),
      from,
    });
  }

  private to(email: string) {
    // [NOTE] Address with domain `@zdd997.com` is not real email address. Only for testing and demo purpose
    if (email.endsWith('@zdd997.com')) {
      return this.configService.getOrThrow<string>('MAIL_ACCOUNT');
    }

    return email;
  }

  private adminUrl(path: string, query?: Record<string, string>) {
    // [NOTE] Skip if path is already an absolute URL
    if (/https?:\/\//.test(path)) return path;

    const url = `${this.configService.getOrThrow('ADMIN_BASE_URL')}${path}`;

    if (!query) return url;
    return `${url}?${new URLSearchParams(query).toString()}`;
  }
}

// ----- HELPERS -----

function encodeBase64(str: string) {
  return Buffer.from(str, 'ascii').toString('base64');
}
