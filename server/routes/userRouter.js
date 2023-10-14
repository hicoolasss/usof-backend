import express from "express";
import controller from "../controllers/userController.js";

const router = express.Router();

router.get('/api/auth/password-reset/:token', controller.showResetPasswordForm);
router.post('/api/auth/password-reset/:token', controller.changePassword);
router.post('/api/auth/password-reset/', controller.resetPassword);
router.get('/', controller.main);
router.post('/api/auth/register', controller.createUser);
router.post('/api/auth/login', controller.authenticateUser);
router.post('/api/auth/logout', controller.logout);
router.post('/api/auth/refresh', controller.refresh);

export default router;