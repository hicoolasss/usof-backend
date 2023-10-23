import Comment from "../models/Comment.js";

export default class commentsController {

    static async createComment(req, res, next) {

        try {

            const { postId, content } = req.body;

            const userId = req.user.id; // Это должно быть частью данных пользователя, установленных в middleware аутентификации

            const commentData = await commentsService.createComment(postId, content, userId);

            return res.json(buildResponse(true, commentData));

        } catch (error) {

            next(error);

        }

    }


}
