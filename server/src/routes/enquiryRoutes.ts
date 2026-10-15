import { Router } from 'express';
import {
  submitEnquiry,
  getAdminEnquiries,
  getAdminEnquiryById,
  updateEnquiryStatus,
  addEnquiryNote,
  exportEnquiriesToCsv,
} from '../controllers/enquiryController.js';
import { enquiryLimiter } from '../middlewares/rateLimiter.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createEnquirySchema,
  updateEnquiryStatusSchema,
  addEnquiryNoteSchema,
} from '../validations/enquiryValidation.js';
import { authenticateAdmin } from '../middlewares/auth.js';

export const publicEnquiryRouter = Router();
publicEnquiryRouter.post('/', enquiryLimiter, validateBody(createEnquirySchema), submitEnquiry);

export const adminEnquiryRouter = Router();
adminEnquiryRouter.use(authenticateAdmin);
adminEnquiryRouter.get('/', getAdminEnquiries);
adminEnquiryRouter.get('/export/csv', exportEnquiriesToCsv);
adminEnquiryRouter.get('/:id', getAdminEnquiryById);
adminEnquiryRouter.patch('/:id', validateBody(updateEnquiryStatusSchema), updateEnquiryStatus);
adminEnquiryRouter.post('/:id/notes', validateBody(addEnquiryNoteSchema), addEnquiryNote);
