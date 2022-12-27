import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface SendMailOptions {
  senderEmail?: string;
  senderName?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class MailService {
  transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('mail.host'),
      port: configService.get('mail.port'),
      secure: configService.get('mail.ssl'),
      requireTLS: configService.get('mail.tls'),
      auth: {
        user: configService.get('mail.user'),
        pass: configService.get('mail.pass'),
      },
    });
  }

  async sendMail(
    mailOptions: SendMailOptions,
  ): Promise<nodemailer.SentMessageInfo> {
    const senderEmail =
      mailOptions.senderEmail || this.configService.get('mail.senderEmail');
    const senderName =
      mailOptions.senderName || this.configService.get('mail.senderName');

    let from = senderEmail;
    if (senderName) {
      from = `"${senderName}" <${senderEmail}>`;
    }

    return await this.transporter.sendMail({
      from: from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
    });
  }
}
