import Post from "../models/Post.js";
import Like from "../models/Like.js";

class postService {

    async createPost(author_id, title, publish_date, status, content) {
        try {
            const post = await Post.create({
                author_id,
                title,
                publish_date,
                status,
                content
            });

            if (!post) {
                throw new Error("Post not created!");
            }

            if (post) {
                return {
                    message: "Post created successfully",
                    post
                };
            }
        } catch (error) {
            console.error("Error in createPost:", error);
            res.status(500).json({ message: error.message });
        }
    }

    async likePost(postId, authorId, type) {
        try {
            const post = await Post.findById(postId);
            console.log(postId, authorId, type);
            
            if (!post) {
                throw new Error("Post not found");
            }
            
            if (post) {
                
                const like = new Like({
                    entity_id: postId,
                    entity_type: 'post',
                    author_id: authorId,
                    type: type
                });

                await like.save();

                return {
                    message: "Like added successfully",
                    like
                };
            }

        } catch (error) {
            console.error("Error in likePost:", error);
            res.status(500).json({ message: error.message });
        }
    }

    async updatePost(req, res) {

    }

    async deletePost(req, res) {

    }

    async deleteLike(req, res) {

    }

    async getAllPosts(req, res) {

    }

    async createComment(req, res) {

    }

    async getPostById(req, res) {

    }

    async getAllComments(req, res) {

    }

    async getAllCategories(req, res) {

    }

    async getAllLikes(req, res) {

    }
}

export default new postService();