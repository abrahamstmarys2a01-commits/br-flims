import { Router } from 'express';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../controllers/adminUserController.js';
import { authenticateAdmin } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createAdminUserSchema,
  updateAdminUserSchema,
} from '../validations/authValidation.js';

const router = Router();

router.use(authenticateAdmin);
router.use(requireRole(['superadmin']));

router.get('/', getAdminUsers);
router.post('/', validateBody(createAdminUserSchema), createAdminUser);
router.patch('/:id', validateBody(updateAdminUserSchema), updateAdminUser);
router.put('/:id', validateBody(updateAdminUserSchema), updateAdminUser);
router.delete('/:id', deleteAdminUser);

export default router;
