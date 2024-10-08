import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

class postService {

    async createPost(author_id, title, publish_date, status, content, categories) {

        try {
            const post = await Post.create({
                author_id,
                title,
                publish_date,
                status,
                content,
                categories: [categories] // Если вы используете массив категорий, используйте categories: [categories]
            });

            return {
                message: "Post created successfully",
                post
            };
        } catch (error) {
            console.error("Error in createPost service:", error);
            throw error; // Переброс ошибки для обработки на более высоком уровне (например, в контроллере)
        }

    }

    async likePost(postId, userId) {

        try {
            const post = await Post.findById(postId);

            if (!post) {
                throw new Error("Post not found");
            }

            let message;

            const alreadyLiked = post.likes.some(likeId => likeId.equals(userId));

            if (!alreadyLiked) {
                // Если лайка нет, то добавить его
                post.likes.push(userId);
                message = "post liked successfully";
            } else {
                // Если лайк есть, то удалить его
                post.likes = post.likes.filter(likeId => !likeId.equals(userId));
                message = "post unliked successfully";
            }

            await post.save();

            return {
                message,
                totalLikes: post.likes.length // Возвращаем общее количество лайков поста
            };
        } catch (error) {
            console.error("Error in likePost service:", error);
            throw error; // Переброс ошибки для обработки на более высоком уровне
        }
    }


    async updatePost(postId, userId, postData) {
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
            post.categories = postData.categories || post.categories; // Обновите, если ваша модель содержит 'category'

            await post.save();

            return post;
        } catch (error) {
            console.error(error);
            throw error; // Переброс ошибки на уровень выше, чтобы обработать её в контроллере
        }
    }

    async deletePost(postId, userId, userRole) {
        try {
            const post = await Post.findById(postId);

            if (!post) {
                throw new Error("Post not found");
            }

            // Проверяем, является ли пользователь администратором или автором поста
            const isAuthorized = userRole === 'admin' || post.author_id.equals(userId);

            if (!isAuthorized) {
                throw new Error("Not authorized to delete this post");
            }

            await Post.deleteOne({ _id: postId });

            return { message: "Post deleted successfully" };
        } catch (error) {
            // Здесь вы можете выбросить ошибку выше, чтобы ваш контроллер мог ее перехватить и обработать соответствующим образом
            console.error("Error in deletePost service:", error);
            throw error;
        }
    }

    async deleteLike(postId, userId) {

        try {
            console.log(postId, userId);

            // Найти пост по ID
            const post = await Post.findById(postId);

            if (!post) {
                throw new Error('Post not found');
            }

            // Проверить, есть ли у поста лайк от этого пользователя
            if (!post.likes.includes(userId)) {
                throw new Error('You have not liked this post');
            }

            // Удалить ID пользователя из массива лайков
            post.likes.pull(userId);

            await post.save();

            return { post, message: 'Like deleted successfully' }; // или можете вернуть любую другую полезную информацию

        } catch (error) {
            console.error("Error in deleteLike service:", error);
            throw error;

        }

    }

    async getPosts() {

        try {

            const posts = await Post.find();
            return posts;

        } catch (error) {

            console.error("Error in getAllPosts service:", error);
            throw error;

        }
    }

    async createComment(postId, authorId, content) {

        try {
            // Найти пост, к которому нужно добавить комментарий
            const post = await Post.findById(postId);
            if (!post) throw new Error('Post not found');

            // Создать объект комментария
            const newComment = new Comment({
                author_id: authorId,
                content,
                post: postId,
                // publish_date и status автоматически устанавливаются согласно вашей схеме
            });

            await newComment.save();
            console.log(post);
            // Добавить новый комментарий к массиву комментариев поста
            post.comments.push(newComment._id);

            // Сохранить пост с новым комментарием
            await post.save();

            return {
                message: 'Comment created successfully',
                comment: newComment,
            };

        } catch (error) {

            console.error('Error in createComment service:', error);
            throw error; // Перебрасывание ошибки на уровень выше для обработки в контроллере

        }

    }

    async getPostById(postId) {
        try {
            // Поиск поста по ID
            const post = await Post.findById(postId)

            if (!post) {
                throw new Error('Post not found');
            }

            if (!post.author_id || typeof post.author_id.toHexString !== 'function') {
                throw new Error('Invalid author_id for the post');
            }

            // Преобразование author_id в строку
            const authorIdString = post.author_id.toHexString();

            return post;
        } catch (error) {
            console.error('Error in getPostById service:', error);
            throw error;
        }
    }


    async getCommentsByPostId(postId) {

        try {

            const post = await Post.findById(postId).populate('comments.author_id', 'login _id'); // Это только верно, если комментарии хранятся внутри поста в качестве массива вложенных документов.

            if (!post) {
                throw new Error('Post not found');
            }

            return post.comments;

        } catch (error) {

            console.error("Error in getPostComments service:", error);
            throw error;

        }

    }

    async getAssociatedCategories(postId) {
        try {
            // Найти пост по ID и заполнить связанные категории
            // Обратите внимание, что это работает, если у вас есть поле "categories" в вашем Post модели, которое хранит ссылки на объекты Category
            const post = await Post.findById(postId).populate('categories');

            if (!post) {
                throw new Error('Post not found');
            }

            return post.categories;
        } catch (error) {
            console.error("Error in getAssociatedCategories service:", error);
            throw error;
        }
    }

    async getPostLikes(postId) {
        try {
            // Найти пост по ID и заполнить связанные лайки
            // Обратите внимание, что это работает, если у вас есть поле "likes" в вашей модели Post, которое хранит ссылки на объекты Like
            const post = await Post.findById(postId).populate('likes');

            if (!post) {
                throw new Error('Post not found');
            }

            return post.likes;
        } catch (error) {
            console.error("Error in getPostLikes service:", error);
            throw error;
        }
    }
}

export default new postService();