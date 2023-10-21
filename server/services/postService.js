import Post from "../models/Post.js";
import Like from "../models/Like.js";

class postService {

    static async createPost(author_id, title, publish_date, status, content) {
        try {
            const post = await Post.create({
                author_id,
                title,
                publish_date,
                status,
                content
            });


            return {
                message: "Post created successfully",
                post
            };
        } catch (error) {
            console.error("Error in createPost:", error);
            throw error; // Переброс ошибки для обработки на более высоком уровне (например, в контроллере)
        }


    }

    static async likePost(postId, authorId, type) {
        try {
            const post = await Post.findById(postId);
            console.log(postId, authorId, type);

            if (!post) {
                throw new Error("Post not found");
            }

            // Проверка на существование предыдущего лайка/дизлайка от этого пользователя
            const existingLike = await Like.findOne({ entity_id: postId, author_id: authorId });
            if (existingLike) {
                throw new Error("You have already reacted to this post");
            }

            const like = new Like({
                entity_id: postId,
                entity_type: 'post',
                author_id: authorId,
                type
            });

            await like.save();

            return {
                message: "Like added successfully",
                like
            };
        } catch (error) {
            console.error("Error in likePost:", error);
            throw error; // Переброс ошибки для обработки на более высоком уровне
        }
    }


    static async updatePost(postId, userId, postData) {
        try {
            const post = await Post.findById(postId);

            if (!post) {
                throw new Error("Post not found");
            }

            // Используйте 'author_id' вместо 'author'
            if (post.author_id.toString() !== userId) {
                throw new Error("You cannot update posts of other users");
            }

            // Обновление поста данными из postData. Если какое-то поле не предоставлено, оставляем старое значение
            post.title = postData.title || post.title;
            post.content = postData.content || post.content; // Если 'body' представляет 'content' в вашей модели
            // post.category = postData.category || post.category; // Обновите, если ваша модель содержит 'category'

            await post.save();

            return post;
        } catch (error) {
            console.error(error);
            throw error; // Переброс ошибки на уровень выше, чтобы обработать её в контроллере
        }
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

export default new postService();