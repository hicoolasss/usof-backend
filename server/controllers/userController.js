import path from "path";
import User from "../models/User.js";
import jsonwebtoken from "jsonwebtoken";
import userService from "../services/userService.js";

import ResetPasswordToken from "../models/resetPassworToken.js";


export default class userController {

    static main(req, res) {
        res.sendFile(path.resolve('public', 'index.html'));
    }

    static async createUser(req, res) {
        try {
            const { login, password, full_name, email } = req.body;

            const userData = await userService.registration(login, password, full_name, email);
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
            const userData = await userService.login(login, password);
            console.log("UserData:", userData);
            res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(userData);
        } catch (error) {
            console.error("Error creating user:", error);

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
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    }

    static async refresh(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            console.error('Ошибка при обновлении токена:', error);
        }
    }

    static async resetPassword(req, res) {
        try {
            const { email } = req.body;
            const userData = await userService.resetPassword(email);
            return res.json(userData);
        } catch (error) {
            console.error('Ошибка при сбросе пароля:', error);
        }
    }

    static async changePassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            
            await userService.changePasswrod(token, newPassword);
            
            return res.json({ message: "Password successfully updated" });
        } catch (error) {
            console.error('Error during password change:', error);
            return res.status(500).json({ message: "Server error" });
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
            console.error('Error during password change:', error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    static async getUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (error) {
            console.error('Ошибка при получении пользователей:', error);
        }
    }
}