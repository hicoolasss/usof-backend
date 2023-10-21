import Post from "../models/Post.js";
import postService from "../services/postService.js";

export default class postController {

    static async createPost(req, res) {

        try {
            const { author_id, title, publish_date, status, content } = req.body;

            const postData = await postService.createPost(author_id, title, publish_date, status, content);

            return res.json(postData);
        } catch (error) {
            console.error("Error in createPost:", error);
            return res.status(500).json({ message: error.message });
        }
    }

    static async likePost(req, res) {
        try {
            const postId = req.params.id;
            const authorId = req.user.id;  // Предполагается, что у вас есть middleware для аутентификации
            const { type } = req.body; // 'like' или 'dislike'

            const likeData = await postService.likePost(postId, authorId, type);


            return res.json(likeData);

        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }

    }

    static async updatePost(req, res) {
        try {
            const postId = req.params.id;
            const userId = req.user.id;
            // Ожидание завершения асинхронной операции и передача необходимых данных в тело запроса

            const updated_post = await postService.updatePost(postId, userId, req.body);

            return res.json(updated_post);
        } catch (error) {
            console.error(error);
            if (error.message === 'Post not found') {
                return res.status(404).send({ message: 'Пост не найден' });
            } else if (error.message === 'You cannot update posts of other users') {
                return res.status(403).send({ message: 'Вы не можете обновлять посты других пользователей' });
            }
            // Ответ уже был отправлен в одном из условий выше, если ни одно из условий не было выполнено, то отправляем 500 ошибку.
            return res.status(500).send({ message: 'Произошла ошибка при обновлении поста' });
        }

    }

    static async deletePost(req, res) {
        try {
            const post_id = req.params.id; // извлечение post_id из параметров запроса
            const userId = req.user.id; // Это должно быть частью данных пользователя, установленных в middleware аутентификации
            const userRole = req.user.role; // Аналогично, это должно быть в вашем объекте req.user

            const response = await postService.deletePost(post_id, userId, userRole);

            return res.json(response);
        } catch (error) {
            console.error("Error in controller:", error);
            // Вы можете отправить разные статусы ошибок в зависимости от типа ошибки
            if (error.message === "Post not found") {
                return res.status(404).json({ message: error.message });
            } else if (error.message === "Not authorized to delete this post") {
                return res.status(403).json({ message: error.message });
            } else {
                return res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    static async deleteLike(req, res) {

    }

    static async getAllPosts(req, res) {

    }

    static async createComment(req, res) {

    }

    static async getPostById(req, res) {

    }

    static async getAllComments(req, res) {

    }

    static async getAllCategories(req, res) {

    }

    static async getAllLikes(req, res) {

    }
}