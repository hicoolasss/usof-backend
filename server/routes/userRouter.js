import express from "express";
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import postController from "../controllers/postController.js";
import categoriesController from "../controllers/categoriesController.js";
import commentsController from "../controllers/commentsController.js";

import authenticationMiddleware from "../middlewares/userAuth.js";

import passport from 'passport';

import UserDto from "../dto/userDto.js";
import buildResponse from "../utils/buildResponse.js";


const router = express.Router();

//pasword reset routes
router.get('/api/auth/password-reset/:token', authController.showResetPasswordForm);
router.post('/api/auth/password-reset/:token', authController.changePassword);
router.post('/api/auth/password-reset/', authController.resetPassword);
//verify email routes
router.post('/api/auth/verify/', authController.sendVerificationMail); //+
router.post('/api/auth/verify/:token', authController.getUpdatedEmailVerificationStatus); //+
//auth routes
router.post('/api/auth/register', authController.createUser); //+
router.post('/api/auth/login', authController.authenticateUser); //+
router.post('/api/auth/logout', authController.logout); //+
router.get('/api/auth/refresh', authController.refresh); //+ rework
//user routes
router.get('/api/users/', userController.getUsers);
router.get('/api/users/:id', userController.getUserById); //+
router.post('/api/users/', userController.createUserForAdmin); //+
router.patch('/api/users/:userId/avatar', userController.uploadUserAvatar); //+     
router.patch('/api/users/:userId', userController.updateUser); //+
router.delete('/api/users/:userId', userController.deleteUser); //+
//post routes
router.post('/api/posts/', authenticationMiddleware, postController.createPost); //+
router.post('/api/posts/:id/like', authenticationMiddleware, postController.likePost);
router.patch('/api/posts/:id', authenticationMiddleware, postController.updatePost);
router.delete('/api/posts/:id', authenticationMiddleware, postController.deletePost);
router.delete('/api/posts/:id/like', authenticationMiddleware, postController.deleteLike);
router.get('/api/posts/', postController.getPosts); //+
router.post('/api/posts/:id/comments', authenticationMiddleware, postController.createComment);
router.get('/api/posts/:id', postController.getPostById);
router.get('/api/posts/:id/comments', postController.getCommentsByPostId);
router.get('/api/posts/:id/categories', postController.getAssociatedCategories);
//category routes
router.post('/api/categories', authenticationMiddleware, categoriesController.createCategory); //+
router.get('/api/categories', categoriesController.getCategories); //+
router.get('/api/categories/:id', categoriesController.getCategoryById); //+
router.patch('/api/categories/:id', authenticationMiddleware, categoriesController.updateCategorybyId);
router.delete('/api/categories/:id', authenticationMiddleware, categoriesController.deleteCategoryById);
router.get('/api/categories/:id/posts', categoriesController.getPostsByCategoryId);
//comment routes
router.get('/api/comments/:id', commentsController.getCommentById);
router.post('/api/comments/:id/like', authenticationMiddleware, commentsController.likeComment);
router.get('/api/comments/:id/likes', commentsController.getLikesByCommentId);
router.patch('/api/comments/:id', authenticationMiddleware, commentsController.updateCommentById);
router.delete('/api/comments/:id', authenticationMiddleware, commentsController.deleteCommentById);
router.delete('/api/comments/:id/like', authenticationMiddleware, commentsController.deleteLikeUnderComment);

export default router;