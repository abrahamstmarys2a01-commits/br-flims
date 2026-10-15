import { Router } from 'express';
import {
  getPublicPageBySlug,
  getAdminPages,
  getAdminPageById,
  updateAdminPage,
} from '../controllers/pageController.js';
import { authenticateAdmin } from '../middlewares/auth.js';
import { validateBody } from '../middlewares/validate.js';
import { updatePageSchema } from '../validations/pageValidation.js';

export const publicPageRouter = Router();
publicPageRouter.get('/:slug', getPublicPageBySlug);

export const adminPageRouter = Router();
adminPageRouter.use(authenticateAdmin);
adminPageRouter.get('/', getAdminPages);
adminPageRouter.get('/:id', getAdminPageById);
adminPageRouter.patch('/:id', validateBody(updatePageSchema), updateAdminPage);
adminPageRouter.put('/:id', validateBody(updatePageSchema), updateAdminPage);
