import userService from "../services/userService.js";

import buildResponse from "../utils/buildResponse.js";

export default class userController {


    static async getUsers(req, res, next) {

        try {
            console.log("Get Users");

            const users = await userService.getAllUsers();
            return res.json(buildResponse(true, users));

        } catch (error) {

            next(error);

        }

    }

    static async getUserById(req, res, next) {
        try {
            console.log("Get User by ID");
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            return res.json(buildResponse(true, user));
        } catch (error) {
            next(error);
        }
    }

    static async createUserForAdmin(req, res, next) {
        try {
            const { login, password, email, role } = req.body;

            const userData = await userService.createUser(login, password, email, role);

            console.log("User created successfully");

            return res.json(buildResponse(true, { userData, message: "User created successfully" }));
        } catch (error) {
            next(error);
        }
    }

    static async uploadUserAvatar(req, res, next) {
        try {

            const { userId } = req.body;
            const avatarPath = req.files.avatar;

            const userData = await userService.uploadUserAvatar(userId, avatarPath);

            return res.json(buildResponse(true, { userData, message: "User avatar successfully uploaded" }));
        } catch (error) {
            next(error);
        }
    }

    static async updateUser(req, res, next) {
        try {
            const { userId } = req.params; // Получаем ID пользователя из параметра маршрута
            const userData = req.body; // Получаем данные пользователя из тела запроса

            // Вызываем соответствующий метод из сервиса (этот метод вам также, возможно, потребуется создать)
            const user = await userService.updateUser(userId, userData);


            console.log("User successfully updated:", user);
            return res.json(buildResponse(true, { user, message: "User successfully updated" }));
        } catch (error) {
            next(error);
        }


    }

    static deleteUser(req, res, next) {
        try {
            const { userId } = req.params; // Получаем ID пользователя из параметра маршрута

            // Вызываем соответствующий метод из сервиса (этот метод вам также, возможно, потребуется создать)
            const user = userService.deleteUser(userId);


            return res.json(buildResponse(true, { message: "User successfully deleted" }));
        } catch (error) {
            next(error);
        }

    }
}