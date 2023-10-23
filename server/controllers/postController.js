import Post from "../models/Post.js";
import postService from "../services/postService.js";
import buildResponse from "../utils/buildResponse.js";

export default class postController {

    static async createPost(req, res, next) {

        try {
            const { title, publish_date, status, content, categories } = req.body;

            const author_id = req.user.id; // Это должно быть частью данных пользователя, установленных в middleware аутентификации

            console.log(author_id);

            const postData = await postService.createPost(author_id, title, publish_date, status, content, categories);

            return res.json(buildResponse(true, postData));

        } catch (error) {

            next(error);

        }
    }

    static async likePost(req, res, next) {
        try {
            const postId = req.params.id;
            const userId = req.user.id; // Предполагается, что у вас есть middleware для аутентификации

            const likeData = await postService.likePost(postId, userId);

            return res.json(buildResponse(true, likeData));
        } catch (error) {
            next(error);
        }
    }

    static async updatePost(req, res, next) {

        try {

            const postId = req.params.id;
            const userId = req.user.id;
            // Ожидание завершения асинхронной операции и передача необходимых данных в тело запроса

            const updated_post = await postService.updatePost(postId, userId, req.body);

            return res.json(buildResponse(true, updated_post));

        } catch (error) {

            next(error);

        }

    }

    static async deletePost(req, res, next) {

        try {

            const post_id = req.params.id; // извлечение post_id из параметров запроса
            const userId = req.user.id; // Это должно быть частью данных пользователя, установленных в middleware аутентификации
            const userRole = req.user.role; // Аналогично, это должно быть в вашем объекте req.user

            const response = await postService.deletePost(post_id, userId, userRole);

            return res.json(buildResponse(true, response));

        } catch (error) {

            next(error);

        }
    }

    static async deleteLike(req, res, next) {

        const postId = req.params.id;
        const userId = req.user.id; // или как вы получаете ID пользователя из запроса

        try {
            const post = await postService.deleteLike(postId, userId); // предполагается, что сервис инстанциирован или методы статические

            return res.json(buildResponse(true, post, "Like has been removed successfully."));

        } catch (error) {

            next(error); // передаем ошибку в обработчик ошибок

        }
    }

    static async getPosts(req, res, next) {

        try {

            const posts = await postService.getPosts();

            return res.json(buildResponse(true, posts));

        } catch (error) {

            next(error);

        }

    }

    static async createComment(req, res, next) {

        try {

            const { content } = req.body;
            const postId = req.params.id; // Получаем ID поста из параметров маршрута
            const userId = req.user.id; // Получаем ID пользователя из объекта запроса (после аутентификации)

            // Вызов метода сервиса для создания комментария
            const commentData = await postService.createComment(postId, userId, content);

            // Отправка ответа
            return res.json(buildResponse(true, commentData));

        } catch (error) {

            next(error); // Передача ошибки в middleware обработки ошибок

        }
    }

    static async getPostById(req, res, next) {

        try {

            const postId = req.params.id; // Получаем ID поста из параметров URL

            // Вызов метода сервиса для получения поста по ID
            const postData = await postService.getPostById(postId);

            // Отправка ответа
            return res.json(buildResponse(true, postData));

        } catch (error) {

            next(error); // Передача ошибки в middleware обработки ошибок

        }

    }

    static async getCommentsByPostId(req, res, next) {

        try {

            const postId = req.params.id; // Получаем ID поста из параметров URL

            const comments = await postService.getCommentsByPostId(postId);

            return res.json(buildResponse(true, comments));


        } catch (error) {

            next(error); // Передача ошибки в middleware обработки ошибок

        }

    }

    static async getAssociatedCategories(req, res, next) {
        try {
            const postId = req.params.id; // или req.body.postId в зависимости от вашей конфигурации маршрута

            // предполагается, что postService - это экземпляр вашего сервисного класса, содержащий метод getAssociatedCategories
            const categories = await postService.getAssociatedCategories(postId);

            return res.json(buildResponse(true, categories));
        } catch (error) {
            next(error); // передает ошибку обработчику ошибок
        }
    }

    static async getPostLikes(req, res, next) {
            
            try {
    
                const postId = req.params.id; // или req.body.postId в зависимости от вашей конфигурации маршрута
    
                // предполагается, что postService - это экземпляр вашего сервисного класса, содержащий метод getAssociatedCategories
                const likes = await postService.getPostLikes(postId);
    
                return res.json(buildResponse(true, likes));
    
            } catch (error) {
    
                next(error); // передает ошибку обработчику ошибок
    
            }
    }
}