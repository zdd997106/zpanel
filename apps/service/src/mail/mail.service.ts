import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendApplicationApproval(name: string, email: string, password: string) {
    const url = `https://zpanel.zdd997.com/sign-in?with=${encodeURIComponent(Buffer.from(JSON.stringify({ email, password }), 'ascii').toString('base64'))}`;

    await this.mailerService.sendMail({
      from: `"ZPanel" <${this.configService.getOrThrow('MAIL_ACCOUNT')}>`,
      to: email,
      subject: 'ZPanel: Application Approved',
      template: './application-approval',
      context: { name, email, password, url },
    });
  }

  async sendApplicationRejection(name: string, email: string, reason: string) {
    await this.mailerService.sendMail({
      from: `"ZPanel" <${this.configService.getOrThrow('MAIL_ACCOUNT')}>`,
      to: email,
      subject: 'ZPanel: Application Rejected',
      template: './application-rejection',
      context: { name, reason },
    });
  }
}
