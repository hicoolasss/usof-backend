import User from '../models/User.js';
import tokenService from './tokenService.js';
import mailService from './mailService.js';
import UserDto from '../dto/userDto.js';
import bcrypt from 'bcrypt';
import  ResetPasswordToken from '../models/resetPasswordToken.js';

class authService {
    async registration(login, password, email) {
        try {
            const check_login = await User.findOne({ login: login });
            const check_email = await User.findOne({ email: email });

            if (check_login) {
                throw new Error("Login already exists!");
            }

            if (check_email) {
                throw new Error("Email already exists!");
            }
            console.log("Login:", login)
            console.log("Password to hash:", password);
            
            const saltRounds = 10; // you can adjust this number based on your security requirement
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = await User.create({
                login,
                password_hash: hashedPassword,
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
            console.error("Error creating user in service:", error);
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
    
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async changePassword(token, newPassword) {
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

}

export default new authService();