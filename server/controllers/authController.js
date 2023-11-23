import path from "path";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import authService from "../services/authService.js";
import mailService from "../services/mailService.js";
import ResetPasswordToken from "../models/resetPasswordToken.js";
import verifyEmailToken from "../models/verifyEmailToken.js";

import buildResponse from "../utils/buildResponse.js";



export default class authController {

    static async createUser(req, res, next) {

        try {

            const { login, password, email, role } = req.body;

            const userData = await authService.registration(login, password, email, role);

            res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 180 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(buildResponse(true, userData));

        } catch (error) {

            next(error);
        }

    }


    // static async createUserByGoogle(req, res, next) {

    //     try {

    //         const { profile } = req.body;

    //         const userData = await authService.registrationByGoogle(profile);

    //         res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 180 * 24 * 60 * 60 * 1000, httpOnly: true });

    //         return res.json(buildResponse(true, userData));

    //     } catch (error) {

    //         next(error);
    //     }

    // }

    static async authenticateUser(req, res, next) {

        try {

            const { login, password } = req.body;

            console.log("login:", login);
            console.log("Password:", password);

            const userData = await authService.login(login, password);
            res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 180 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(buildResponse(true, userData));

        } catch (error) {

            next(error);
            return;

        }

    }

    static async logout(req, res, next) {

        try {

            const { refreshToken } = req.cookies;

            const token = await authService.logout(refreshToken);

            res.clearCookie('refreshToken');

            return res.json(buildResponse(true, token));

        } catch (error) {

            next(error);

        }

    }

    // static async refresh(req, res, next) {

    //     try {

    //         const { refreshToken } = req.cookies;

    //         const userData = await authService.refresh(refreshToken);

    //         res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

    //         return res.json(buildResponse(true, userData));

    //     } catch (error) {

    //         next(error);

    //     }

    // }

    static async resetPassword(req, res, next) {

        try {

            const { email } = req.body;

            const token = uuidv4();
            await mailService.sendResetPasswordMail(email, token, `${process.env.CLIENT_URL}/changePassword/${token}`);

            return res.json(buildResponse(true, { message: "Mail successfully sent" })); // 'sended' должно быть 'sent'

        } catch (error) {

            next(error);

        }

    }

    static async changePassword(req, res, next) {

        try {
            const { token, newPassword } = req.body;

            await authService.changePassword(token, newPassword);

            return res.json(buildResponse(true, { message: "Password successfully changed" }));

        } catch (error) {

            next(error);

        }

    }

    static async showResetPasswordForm(req, res, next) {

        try {

            const token = req.params.token;

            const resetTokenEntry = await ResetPasswordToken.findOne({ token });

            if (!resetTokenEntry) {
                return res.status(400).json(buildResponse(false, { message: "Invalid or expired password reset token!" }));
            }

            // Здесь вы можете отобразить форму для ввода нового пароля или сделать другие действия.
            return res.send(`${process.env.API_URL}/changePassword/${token}`);

        } catch (error) {

            next(error);

        }

    }


    static async sendVerificationMail(req, res, next) {

        try {
            const { email } = req.body;

            const token = uuidv4();

            console.log("email:", email);

            await mailService.sendVerificationMail(email, token, `${process.env.CLIENT_URL}/verify/${token}`);

            return res.json(buildResponse(true, { message: "Mail successfully sent" }));

        } catch (error) {

            next(error);

        }

    }

    static async showVereficationForm(req, res, next) {

        try {

            const token = req.params.token;

            const verifyTokenEntry = await verifyEmailToken.findOne({ token });

            if (!verifyTokenEntry) {
                return res.status(400).json({ message: "Invalid or expired email verification token!" });
            }

            const user = await User.findById(verifyTokenEntry.userId);

            if (!user) {
                return res.status(400).json({ message: "User not found!" });
            }

            // Устанавливаем флаг is_email_verified в true
            user.is_email_verified = true;

            await user.save();  // Сохраняем изменения

            return res.send('Your email successfully verified');


        } catch (error) {

            next(error);

        }

    }

    static async getUpdatedEmailVerificationStatus(req, res, next) {
        try {
            const token = req.params.token;

            const verifyTokenEntry = await verifyEmailToken.findOne({ token });

            if (!verifyTokenEntry) {
                return res.status(400).json({ message: "Invalid or expired email verification token!" });
            }

            const user = await User.findById(verifyTokenEntry.userId).select('login email profile_picture_path is_email_verified rating role _id');;

            if (!user) {
                return res.status(400).json({ message: "User not found!" });
            }

            // Устанавливаем флаг is_email_verified в true
            user.is_email_verified = true;

            await user.save();  // Сохраняем изменения

            res.json(buildResponse(true, { user, message: "Email successfully verified" }));
        } catch (error) {
            next(error);
        }

    }

    static async refresh(req, res, next) {
        console.log("refresh");

        try {

            const { refreshToken } = req.cookies;

            console.log("refreshToken:", refreshToken);

            const userData = await authService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 180 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(buildResponse(true, userData));

        } catch (error) {

            next(error);

        }

    }


}