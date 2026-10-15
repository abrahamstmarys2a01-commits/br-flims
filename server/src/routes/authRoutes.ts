import { Router } from 'express';
import {
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { validateBody } from '../middlewares/validate.js';
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = Router();

router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/logout', authenticateAdmin, logout);
router.get('/me', authenticateAdmin, getCurrentUser);
router.post('/forgot-password', authLimiter, validateBody(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validateBody(resetPasswordSchema), resetPassword);

export default router;
