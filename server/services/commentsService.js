import Comment from "../models/Comment.js";


class commentsService {


    async likeComment(commentId, userId) {

        try {

            const comment = await Comment.findById(commentId);

            if (!comment) {
                throw new Error("Comment not found");
            }

            let message;

            const alreadyLiked = comment.likes.some(likeId => likeId.equals(userId));

            if (!alreadyLiked) {
                // Если лайка нет, то добавить его
                comment.likes.push(userId);
                message = "Comment liked successfully";
            } else {
                // Если лайк есть, то удалить его
                comment.likes = comment.likes.filter(likeId => !likeId.equals(userId));
                message = "Comment unliked successfully";
            }

            await comment.save();

            return { comment, message };

        } catch (error) {

            console.error("Error in likeComment service:", error);
            throw error;

        }

    }

    async getCommentById(commentId) {

        try {

            const comment = await Comment.findById(commentId);

            if (!comment) {
                throw new Error("Comment not found");
            }

            return comment;

        } catch (error) {

            console.error("Error in getCommentById service:", error);
            throw error;

        }

    }

    async getLikesByCommentId(commentId) {

        try {

            const comment = await Comment.findById(commentId).populate('likes');

            if (!comment) {
                throw new Error("Comment not found");
            }

            return comment.likes.length;

        } catch (error) {

            console.error("Error in getLikesByCommentId service:", error);
            throw error;

        }

    }

    async updateCommentById(commentId, content, userId) {

        try {

            const comment = await Comment.findById(commentId);

            if (!comment) {
                throw new Error("Comment not found");
            }

            if (!comment.author_id.equals(userId)) {
                throw new Error("You are not the author of this comment");
            }

            if (!content) {
                throw new Error("Content is required");
            }

            comment.content = content;

            await comment.save();

            return { comment, message: "Comment updated successfully" };

        } catch (error) {

            console.error("Error in updateCommentById service:", error);
            throw error;

        }

    }


    async deleteCommentById(commentId, userId) {

        try {

            const comment = await Comment.findById(commentId);

            if (!comment) {
                throw new Error("Comment not found");
            }

            if (!comment.author_id.equals(userId)) {
                throw new Error("You are not the author of this comment");
            }

            await comment.deleteOne({ _id: commentId });

            return { message: "Comment deleted successfully" };


        } catch (error) {

            console.error("Error in deleteCommentById service:", error);
            throw error;

        }

    }


    async deleteLikeUnderComment(commentId, userId) {

        try {

            const comment = await Comment.findById(commentId);

            if (!comment) {
                throw new Error("Comment not found");
            }

            if (!comment.likes.includes(userId)) {
                throw new Error("You have not liked this comment");
            }

            comment.likes.pull(userId);

            await comment.save();

            return { comment, message: "Like deleted successfully" };

        } catch (error) {

            console.error("Error in deleteLikeUnderComment service:", error);
            throw error;

        }

    }

}

export default new commentsService();