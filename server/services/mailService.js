import nodemailer from 'nodemailer';
import User from '../models/User.js';
import ResetPasswordToken from '../models/resetPasswordToken.js';
import verifyEmailToken from '../models/verifyEmailToken.js';

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendResetPasswordMail(to, token, link) {
        const user = await User.findOne({ email: to });
        if (!user) throw new Error("User not found!");

        const resetToken = new ResetPasswordToken({
            userId: user._id,
            token: token
        });
        await resetToken.save();
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Смена пароля на ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Для смены пароля</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }

    async sendVerificationMail(to, token, link) {
        const user = await User.findOne({ email: to });
        if (!user) throw new Error("User not found!");

        const verifyToken = new verifyEmailToken({
            userId: user._id,
            token: token
        });
        await verifyToken.save();
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Верификация на ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Для верификации</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

export default new MailService();