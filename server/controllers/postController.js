import Post from "../models/Post.js";
import postService from "../services/postService.js";
import buildResponse from "../utils/buildResponse.js";

export default class postController {

    static async createPost(req, res, next) {

        try {
            const { author_id, title, publish_date, status, content } = req.body;

            const postData = await postService.createPost(author_id, title, publish_date, status, content);

            return res.json(buildResponse(true, postData));
        
        } catch (error) {
        
            next(error);
        
        }
    }

    static async likePost(req, res, next) {
        
        try {
        
            const postId = req.params.id;
            const authorId = req.user.id;  // Предполагается, что у вас есть middleware для аутентификации
            const { type } = req.body; // 'like' или 'dislike'

            const likeData = await postService.likePost(postId, authorId, type);

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

    }

    static async getAllPosts(req, res, next) {

    }

    static async createComment(req, res, next) {

    }

    static async getPostById(req, res, next) {

    }

    static async getAllComments(req, res, next) {

    }

    static async getAllCategories(req, res, next) {

    }

    static async getAllLikes(req, res, next) {

    }
}