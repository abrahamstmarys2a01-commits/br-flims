import { Router } from 'express';
import authRoutes from './authRoutes.js';
import { publicMovieRouter, adminMovieRouter } from './movieRoutes.js';
import { publicEnquiryRouter, adminEnquiryRouter } from './enquiryRoutes.js';
import { publicSiteSettingRouter, adminSiteSettingRouter } from './siteSettingRoutes.js';
import { publicPageRouter, adminPageRouter } from './pageRoutes.js';
import adminUserRoutes from './adminUserRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import auditRoutes from './auditRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'BR Films Cinema API Engine',
  });
});

// Public endpoints
apiRouter.use('/movies', publicMovieRouter);
apiRouter.use('/enquiries', publicEnquiryRouter);
apiRouter.use('/site-settings', publicSiteSettingRouter);
apiRouter.use('/pages', publicPageRouter);

// Admin endpoints
apiRouter.use('/admin/auth', authRoutes);
apiRouter.use('/admin/dashboard', dashboardRoutes);
apiRouter.use('/admin/movies', adminMovieRouter);
apiRouter.use('/admin/enquiries', adminEnquiryRouter);
apiRouter.use('/admin/site-settings', adminSiteSettingRouter);
apiRouter.use('/admin/pages', adminPageRouter);
apiRouter.use('/admin/users', adminUserRoutes);
apiRouter.use('/admin/audit', auditRoutes);
apiRouter.use('/admin/uploads', uploadRoutes);

export default apiRouter;
