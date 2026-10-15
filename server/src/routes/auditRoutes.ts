import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = Router();
router.use(authenticateAdmin);
router.get('/', getAuditLogs);

export default router;
