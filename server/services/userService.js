import User from '../models/User.js';
import tokenService from './tokenService.js';
import mailService from './mailService.js';
import UserDto from '../dto/UserDto.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";
import  ResetPasswordToken from '../models/resetPassworToken.js';

class userService {
    async registration(login, password, full_name, email) {
        try {
            const check_login = await User.findOne({ login: login });
            const check_email = await User.findOne({ email: email });

            if (check_login) {
                throw new Error("Login already exists!");
            }

            if (check_email) {
                throw new Error("Email already exists!");
            }

            const saltRounds = 10; // you can adjust this number based on your security requirement
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = await User.create({
                login,
                password_hash: hashedPassword,
                full_name,
                email
            });
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({ ...userDto });
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            return {
                message: 'User created successfully',
                userId: user._id,
                tokens,
                user: userDto
            };
        } catch (error) {
            throw error;
        }
    }

    async login(login, password) {
        const user = await User.findOne({
            $or: [
                { login: login },
                { email: login }
            ]
        });

        if (!user) {
            // Пользователь с таким именем пользователя или email не существует
            throw new Error("User not found!");
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordMatch) {
            // Пароль не совпадает, отправьте сообщение об ошибке
            throw new Error("Incorrect password!");
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            message: "Authentication successful",
            tokens,
            user: userDto
        };

    }

    async changePasswrod(token, newPassword) {
        const resetTokenEntry = await ResetPasswordToken.findOne({ token });

        if (!resetTokenEntry) {
           throw new Error("Invalid or expired password reset token!");
        }

        const user = await User.findById(resetTokenEntry.userId);
        if (!user) {
            throw new Error("User not found!");
        }
        
        const saltRounds = 10; // you can adjust this number based on your security requirement
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password_hash = hashedPassword; // Здесь вы должны также хешировать пароль!
        await user.save();

        await ResetPasswordToken.findByIdAndDelete(resetTokenEntry._id); // Удаляем использованный токен
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async resetPassword(email) {
        try {
            const token = uuidv4();
            await mailService.sendActivationMail(email, token, `${process.env.API_URL}/api/auth/${token}`);
            return { message: "Password reset link sent to email" };
        } catch (error) {
            throw error;
        }
    }
}

export default new userService();