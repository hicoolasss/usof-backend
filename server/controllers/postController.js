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
            res.status(500).json({ message: error.message });
        }
    }

    static async likePost(req, res) {
        try {
            const postId = req.params.id;
            const authorId = req.user.id;  // Предполагается, что у вас есть middleware для аутентификации
            const { type } = req.body; // 'like' или 'dislike'

            const likeData =  await postService.likePost(postId, authorId, type);
            

            return res.json(likeData);

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }

    }

    static async updatePost(req, res) {

    }

    static async deletePost(req, res) {

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