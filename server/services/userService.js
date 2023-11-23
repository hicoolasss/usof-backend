import User from '../models/User.js';

import UserDto from '../dto/userDto.js';
import bcrypt from 'bcrypt';



import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class userService {

    async getAllUsers() {
        
        const users = await User.find().select('login email profile_picture_path full_name is_email_verified rating role _id');
        
        return users;
    
    }

    async getUserById(userId) {
    
        try {
    
            const user = await User.findById(userId).select('login email profile_picture_path full_name is_email_verified rating role _id');
    
            if (!user) {
               throw new Error("User not found");
            }
    
    
            return user;
    
        } catch (error) {
    
            throw new Error("Error getting user by id:");
    
        }
    }

    async createUser(login, password, email, role) {
        try {
            const check_login = await User.findOne({ login }); // вместо { login: login }
            const check_email = await User.findOne({ email });

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
                email,
                role
            });
            console.log("User:", user);

            const userDto = new UserDto(user);


            return {
                message: 'User created successfully',
                userId: user._id,
                user: userDto
            };
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    async uploadUserAvatar(userId, file) {
        try {
            const user = await this.getUserById(userId);
            console.log("User:", user);
            if (!user) {
                throw new Error("User not found");
            }
            const avatar = file;
            const uploadPath = path.join(__dirname, "..", "public/uploads", avatar.name); // Adjust the path if needed

            // Using Promises for better error handling
            await new Promise((resolve, reject) => {
                avatar.mv(uploadPath, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            user.profile_picture_path = avatar.name;  // Use uploadPath here
            await user.save();

            const userDto = new UserDto(user);

            return userDto;
        } catch (error) {
            console.error("Error uploading user avatar:", error);
            throw error;
        }
    }

    async updateUser(userId, userData) {
        try {
            // Ищем пользователя по ID и обновляем его
            const user = await User.findByIdAndUpdate(userId, userData, { new: true });

            // Если пользователь не найден, возвращаем null или выбрасываем ошибку
            if (!user) {
                throw new Error("User not found");
            }

            const userDto = new UserDto(user);

            return userDto;
        } catch (error) {
            console.error("Error in updateUser:", error);
            throw error; // Передаем ошибку на уровень выше, чтобы контроллер мог ее обработать
        }
    }


    async deleteUser(userId) {
        try {
            const user = await this.getUserById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            await User.findByIdAndDelete(userId);
            return user;
        } catch (error) {
            console.error("Error in deleteUser:", error);
            throw error;
        }
    }


}

export default new userService();