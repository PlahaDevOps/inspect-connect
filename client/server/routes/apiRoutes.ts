import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import * as authController from '../controllers/authController';
import * as activityLogController from '../controllers/activityLogController';

const router = Router();

// public routes
router.post('/signUp', authController.signUp);
router.post('/signIn', authController.signIn);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);
router.post('/fileUpload', authController.fileUpload);
// router.post('/testApi', authController.testApi);

// Protected routes
router.use(authMiddleware);
router.post('/verifyOtp', authController.verifyOtp);
router.post('/resendOtp', authController.resendOtp);
router.post('/logout', authController.logout);

// Activity Log
router.post('/activityLog', activityLogController.createActivityLog);

export default router;
