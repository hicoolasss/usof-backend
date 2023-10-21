import path from "path";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import authService from "../services/authService.js";
import mailService from "../services/mailService.js";
import ResetPasswordToken from "../models/resetPasswordToken.js";
import verifyEmailToken from "../models/verifyEmailToken.js";



export default class authController {

    static async createUser(req, res) {
        try {
            const { login, password, email } = req.body;

            const userData = await authService.registration(login, password, email);
            res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            console.error("Error creating user:", error);

            if (error.message === "Username already exists!") {
                return res.status(500).json({ error: "Username already exists!" });
            }

            if (error.message === "Email already exists!") {
                return res.status(500).json({ error: "Email already exists!" });
            }

            // Обработка всех других ошибок
            return res.status(500).json({ error: error.message });
        }
    }

    static async authenticateUser(req, res) {
        const { login, password } = req.body;
        try {
            console.log("login:", login);
            console.log("Password:", password);
            const userData = await authService.login(login, password);
            res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(userData);
        } catch (error) {
            console.error("Error loggining user:", error);

            if (error.message === "User not found!") {
                return res.status(500).json({ error: "User not found!" });
            }

            if (error.message === "Incorrect password!") {
                return res.status(500).json({ error: "Incorrect password!" });
            }

            // Обработка всех других ошибок
            return res.status(500).json({ error: error.message });
        }
    }

    static async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            return res.status(500).json({ message: error.message });
        }
    }

    static async refresh(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await authService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            console.error('Ошибка при обновлении токена:', error);
        }
    }

    static async resetPassword(req, res) {
        try {
            const { email } = req.body;

            const token = uuidv4();
            await mailService.sendResetPasswordMail(email, token, `${process.env.API_URL}/api/auth/password-reset/${token}`);
            return res.json({ message: "Password reset link sent to email" });

        } catch (error) {
            console.error('Error while password resetting link sending', error);
            return res.status(500).json({ message: error.message });
        }
    }

    static async changePassword(req, res) {
        try {
            const { token, newPassword } = req.body;

            await authService.changePassword(token, newPassword);

            return res.json({ message: "Password successfully updated" });
        } catch (error) {
            console.error('Error after entering new password change:', error);
            return res.status(500).json({ message: error.message });
        }
    }

    static async showResetPasswordForm(req, res) {
        try {

            const token = req.params.token;
            const resetTokenEntry = await ResetPasswordToken.findOne({ token });

            if (!resetTokenEntry) {
                return res.status(400).json({ message: "Invalid or expired token" });
            }

            // Здесь вы можете отобразить форму для ввода нового пароля или сделать другие действия.
            res.send('Here you can enter your new password');
        } catch (error) {
            console.error('Error during entering new password change:', error);
            return res.status(500).json({ message: error.message });
        }
    }


    static async sendVerificationMail(req, res) {
        try {
            const { email } = req.body;
            const token = uuidv4();
            await mailService.sendVerificationMail(email, token, `${process.env.API_URL}/api/auth/verify/${token}`);
            return res.json({ message: "mail successfully sended" });
        } catch (error) {
            console.error('Error during sending verification email:', error);
            return res.status(500).json({ message: error.message });
        }
    }

    static async showVereficationForm(req, res) {
        try {
            console.log("Show verification form");
            const token = req.params.token;

            const verifyTokenEntry = await verifyEmailToken.findOne({ token });

            if (!verifyTokenEntry) {
                return res.status(400).json({ message: "Invalid or expired token" });
            }

            const user = await User.findById(verifyTokenEntry.userId);
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            // Устанавливаем флаг is_email_verified в true
            user.is_email_verified = true;
            await user.save();  // Сохраняем изменения

            res.send('Your email successfully verified');

        } catch (error) {
            console.error('Error during email verification:', error);
            return res.status(500).json({ message: error.message });
        }
    }


}