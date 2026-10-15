import { Router } from 'express';
import { handleSingleUpload } from '../controllers/uploadController.js';
import { upload } from '../middlewares/upload.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = Router();
router.use(authenticateAdmin);
router.post('/', upload.single('file'), handleSingleUpload);

export default router;
