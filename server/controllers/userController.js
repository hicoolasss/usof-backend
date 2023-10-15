import userService from "../services/userService.js";



export default class userController {


    static async getUsers(req, res) {
        try {
            console.log("Get Users");
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (error) {
            console.error("Error in getUsers:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async getUserById(req, res) {
        try {
            console.log("Get User by ID");
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            return res.json(user);
        } catch (error) {
            console.error("Error in getUserById:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async createUserForAdmin(req, res) {
        try {
            const { login, password, email, role } = req.body;

            const userData = await userService.createUser(login, password, email, role);

            console.log("User created successfully");

            return res.json(userData);
        } catch (error) {
            console.error("Error in createUserForAdmin:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async uploadUserAvatar(req, res) {
        try {
            console.log("Upload user avatar");

            const { userId } = req.body;
            const avatarPath = req.files.avatar;

            const userData = await userService.uploadUserAvatar(userId, avatarPath);

            return res.json({ message: "Avatar successfully uploaded" });
        } catch (error) {
            console.error("Error in uploadUserAvatar:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const { userId } = req.params; // Получаем ID пользователя из параметра маршрута
            const userData = req.body; // Получаем данные пользователя из тела запроса

            // Вызываем соответствующий метод из сервиса (этот метод вам также, возможно, потребуется создать)
            const updatedUser = await userService.updateUser(userId, userData);

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.json({ message: "User successfully updated", user: updatedUser });
        } catch (error) {
            console.error("Error in updateUser:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static deleteUser(req, res) {
        try {
            const { userId } = req.params; // Получаем ID пользователя из параметра маршрута

            // Вызываем соответствующий метод из сервиса (этот метод вам также, возможно, потребуется создать)
            const user = userService.deleteUser(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.json({ message: "User successfully deleted" });
        } catch (error) {
            console.error("Error in deleteUser:", error);
            res.status(500).json({ message: error.message });
        }
    }
}