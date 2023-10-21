import express from "express";
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import postController from "../controllers/postController.js";
import authenticationMiddleware from "../middlewares/userAuth.js";


const router = express.Router();


router.get('/api/auth/password-reset/:token', authController.showResetPasswordForm);
router.post('/api/auth/password-reset/:token', authController.changePassword);
router.post('/api/auth/password-reset/', authController.resetPassword);

router.get('/api/auth/verify/:token', authController.showVereficationForm);
router.post('/api/auth/verify/', authController.sendVerificationMail);

router.post('/api/auth/register', authController.createUser);
router.post('/api/auth/login', authController.authenticateUser);
router.post('/api/auth/logout', authController.logout);
router.post('/api/auth/refresh', authController.refresh);

router.get('/api/users/', userController.getUsers);
router.get('/api/users/:id', userController.getUserById);

router.post('/api/users/', userController.createUserForAdmin);
router.patch('/api/users/avatar',  userController.uploadUserAvatar);
router.patch('/api/users/:userId', userController.updateUser);
router.delete('/api/users/:userId', userController.deleteUser);

router.post('/api/posts/', postController.createPost);
router.post('/api/posts/:id/like', authenticationMiddleware, postController.likePost);
router.patch('/api/posts/:id',authenticationMiddleware, postController.updatePost);

export default router;