import Comment from "../models/Comment.js";
import commentsService from "../services/commentsService.js";
import buildResponse from "../utils/buildResponse.js";


export default class commentsController {


    static async likeComment(req, res, next) {

        try {

            const commentId = req.params.id;

            const userId = req.user.id;

            const commentData = await commentsService.likeComment(commentId, userId);

            return res.json(buildResponse(true, commentData));

        } catch (error) {

            next(error);

        }

    }

    static async getCommentById(req, res, next) {

        try {

            const commenId = req.params.id;

            const comment = await commentsService.getCommentById(commenId);

            return res.json(buildResponse(true, comment));

        } catch (error) {

            next(error);

        }

    }

    static async getLikesByCommentId(req, res, next) {

        try {

            const commentId = req.params.id;

            const likes = await commentsService.getLikesByCommentId(commentId);

            return res.json(buildResponse(true, likes));

        } catch (error) {

            next(error);

        }

    }


    static async updateCommentById(req, res, next) {

        try {

            const { content } = req.body;

            const commentId = req.params.id;

            const userId = req.user.id;

            const updated_comment = await commentsService.updateCommentById(commentId, content, userId);

            return res.json(buildResponse(true, updated_comment));

        } catch (error) {

            next(error);

        }

    }


    static async deleteCommentById(req, res, next) {

        try {

            const commentId = req.params.id;

            const userId = req.user.id;

            const deleted_comment = await commentsService.deleteCommentById(commentId, userId);

            return res.json(buildResponse(true, deleted_comment));

        } catch (error) {

            next(error);

        }

    }


    static async deleteLikeUnderComment(req, res, next) {

        try {

            const commentId = req.params.id;

            const userId = req.user.id;

            const deleted_like = await commentsService.deleteLikeUnderComment(commentId, userId);

            return res.json(buildResponse(true, deleted_like));

        } catch (error) {

            next(error);

        }

    }



}
