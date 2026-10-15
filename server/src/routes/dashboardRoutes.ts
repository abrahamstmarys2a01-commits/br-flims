import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = Router();
router.use(authenticateAdmin);
router.get('/', getDashboardStats);

export default router;
