import Category from "../models/Category.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

class categoriesService {

    async createCategory(title, description, userId) {

        try {

            const user = await User.findById(userId);

            // Проверить, является ли пользователь администратором
            if (user.role !== 'admin') {
                throw new Error('Permission denied: only admins can create categories');
            }

            const category = await Category.create({ title, description });

            await category.save();

            return { category, message: "Category created successfully" };

        } catch (error) {

            console.error("Error in createCategory service:", error);
            throw error;

        }

    }


    async getCategories() {

        try {

            const categories = await Category.find();

            return categories;

        } catch (error) {

            console.error("Error in getCategories service:", error);
            throw error;

        }

    }

    async getCategoryById(categoryId) {

        try {

            const category = await Category.findById(categoryId);

            if (!category) {
                throw new Error("Category not found");
            }

            return category;

        } catch (error) {

            console.error("Error in getCategoryById service:", error);
            throw error;

        }

    }

    async updateCategorybyId(categoryId, title, description) {

        try {

            const category = await Category.findById(categoryId);

            if (!category) {
                throw new Error("Category not found");
            }

            category.title = title;
            category.description = description;

            await category.save();

            return { category, message: "Category updated successfully" };

        } catch (error) {

            console.error("Error in updateCategorybyId service:", error);
            throw error;

        }

    }


    async deleteCategoryById(categoryId, userId) {

        try {

            const user = await User.findById(userId);

            // Проверить, является ли пользователь администратором
            if (user.role !== 'admin') {
                throw new Error('Permission denied: only admins can create categories');
            }

            const category = await Category.findById(categoryId);

            if (!category) {
                throw new Error("Category not found");
            }

            await category.deleteOne({ _id: categoryId });

            return { message: "Category deleted successfully" };

        } catch (error) {

            console.error("Error in deleteCategoryById service:", error);
            throw error;

        }

    }

    async getPostsByCategoryId(categoryId) {
            
            try {
    
                const category = await Category.findById(categoryId);
    
                if (!category) {
                    throw new Error("Category not found");
                }
    
                const posts = await Post.find({ categories: { $in: [categoryId] } });
    
                return posts;
    
            } catch (error) {
    
                console.error("Error in getPostsByCategoryId service:", error);
                throw error;
    
            }
    
        }

}

export default new categoriesService();