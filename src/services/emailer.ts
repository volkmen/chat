import { createTransport } from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import type SMTPPool from 'nodemailer/lib/smtp-pool';

class EmailVerificationService {
  private transporter: Mail<SMTPPool.SentMessageInfo, SMTPPool.Options>;

  constructor() {
    this.transporter = this.getTransporter();
  }

  private getTransporter() {
    const options: SMTPPool.Options = {
      host: process.env.SMTP_HOST || 'smtp.ukr.net',
      port: +(process.env.SMTP_PORT || 465),
      secure: true,
      pool: true,
      auth: {
        user: process.env.SMTP_AUTH_USER || 'yardev@ukr.net',
        pass: process.env.SMTP_AUTH_PASSWORD || 'YmpdWI9MtDGCHAC6'
      }
    };

    return createTransport(options);
  }

  private sendMessage({
    text,
    html,
    subject,
    to
  }: {
    text?: string;
    html?: string;
    subject: string;
    to: string | string[];
  }) {
    this.transporter
      .sendMail({
        from: process.env.SMTP_AUTH_USER || 'yardev@ukr.net', // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html // html body
      })
      .then(res => {
        console.log('SUCCESSFULLY sent', res);
      })
      .catch(e => {
        console.error(e);
        throw e;
      });
  }

  public sendEmailVerificationToken({ token, to }: { token: string | number; to: string | string[] }) {
    return this.sendMessage({
      to,
      subject: 'EmailVerification Token',
      html: `<div>
                <h2>CONGRATULATIONS!</h2>
                <p>You succeffuly signed up to the best app in the world! </p>
                <br />
                <p>Pls verify your email address. Pls input this verification code <b style="color: #2563eb">${token}</b> into the
                    <a href="http://localhost:4000/#verify-email" />
                </p>
            </div>`
    });
  }
}

export default EmailVerificationService;
