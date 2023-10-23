import Post from "../models/Post.js";
import categoriesService from "../services/categoriesService.js";
import buildResponse from "../utils/buildResponse.js";

export default class categoriesController {

    static async createCategory(req, res, next) {

        try {

            const { title, description } = req.body;

            const userId = req.user.id; // Это должно быть частью данных пользователя, установленных в middleware аутентификации

            const categoryData = await categoriesService.createCategory(title, description, userId);

            return res.json(buildResponse(true, categoryData));

        } catch (error) {

            next(error);

        }

    }


    static async getCategories(req, res, next) {

        try {

            const categories = await categoriesService.getCategories();

            return res.json(buildResponse(true, categories));

        } catch (error) {

            next(error);

        }

    }

    static async getCategoryById(req, res, next) {

        try {

            const categoryId = req.params.id;

            const category = await categoriesService.getCategoryById(categoryId);

            return res.json(buildResponse(true, category));

        } catch (error) {

            next(error);

        }

    }

    static async updateCategorybyId(req, res, next) {

        try {

            const { title, description } = req.body;

            const categoryId = req.params.id;

            const updated_category = await categoriesService.updateCategorybyId(categoryId, title, description);

            return res.json(buildResponse(true, updated_category));

        } catch (error) {

            next(error);

        }

    }

    static async deleteCategoryById(req, res, next) {

        try {

            const categoryId = req.params.id;

            const userId = req.user.id; // Это должно быть частью данных пользователя, установленных в middleware аутентификации

            const deleted_category = await categoriesService.deleteCategoryById(categoryId, userId);

            return res.json(buildResponse(true, deleted_category));

        } catch (error) {

            next(error);

        }

    }

    static async getPostsByCategoryId(req, res, next) {

        try {

            const categoryId = req.params.id;

            const posts = await categoriesService.getPostsByCategoryId(categoryId);

            return res.json(buildResponse(true, posts));

        } catch (error) {

            next(error);

        }

    }

}