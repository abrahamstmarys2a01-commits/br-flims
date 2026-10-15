import { Router } from 'express';
import {
  getPublicSettings,
  getAdminSettings,
  updateAdminSettings,
} from '../controllers/siteSettingController.js';
import { authenticateAdmin } from '../middlewares/auth.js';
import { validateBody } from '../middlewares/validate.js';
import { updateSiteSettingSchema } from '../validations/siteSettingValidation.js';

export const publicSiteSettingRouter = Router();
publicSiteSettingRouter.get('/', getPublicSettings);

export const adminSiteSettingRouter = Router();
adminSiteSettingRouter.use(authenticateAdmin);
adminSiteSettingRouter.get('/', getAdminSettings);
adminSiteSettingRouter.patch('/', validateBody(updateSiteSettingSchema), updateAdminSettings);
adminSiteSettingRouter.put('/', validateBody(updateSiteSettingSchema), updateAdminSettings);
