"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
class EmailVerificationService {
    constructor() {
        this.transporter = this.getTransporter();
    }
    getTransporter() {
        const options = {
            host: process.env.SMTP_HOST || 'smtp.ukr.net',
            port: +(process.env.SMTP_PORT || 465),
            secure: true,
            pool: true,
            auth: {
                user: process.env.SMTP_AUTH_USER || 'yardev@ukr.net',
                pass: process.env.SMTP_AUTH_PASSWORD || 'YmpdWI9MtDGCHAC6'
            }
        };
        return (0, nodemailer_1.createTransport)(options);
    }
    sendMessage({ text, html, subject, to }) {
        this.transporter
            .sendMail({
            from: process.env.SMTP_AUTH_USER || 'yardev@ukr.net', // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html // html body
        })
            .then(res => {
            // console.log('SUCCESSFULLY sent', res);
        })
            .catch(e => {
            console.error(e);
            throw e;
        });
    }
    sendEmailVerificationToken({ token, to }) {
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
exports.default = EmailVerificationService;
