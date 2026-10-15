import { Response } from 'express';
import { Movie } from '../models/Movie.js';
import { Enquiry } from '../models/Enquiry.js';
import { AuditLog } from '../models/AuditLog.js';
import { AuthRequest } from '../middlewares/auth.js';

export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  const [
    totalMovies,
    publishedMovies,
    draftMovies,
    upcomingMovies,
    releasedMovies,
    newEnquiries,
    totalEnquiries,
    recentAudits,
    recentEnquiries,
  ] = await Promise.all([
    Movie.countDocuments(),
    Movie.countDocuments({ publicationStatus: 'Published' }),
    Movie.countDocuments({ publicationStatus: 'Draft' }),
    Movie.countDocuments({ releaseStatus: 'Upcoming' }),
    Movie.countDocuments({ releaseStatus: 'Released' }),
    Enquiry.countDocuments({ status: 'New', isSpam: false }),
    Enquiry.countDocuments({ isSpam: false }),
    AuditLog.find().sort({ createdAt: -1 }).limit(8).lean(),
    Enquiry.find({ isSpam: false }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      metrics: {
        totalMovies,
        publishedMovies,
        draftMovies,
        upcomingMovies,
        releasedMovies,
        newEnquiries,
        totalEnquiries,
      },
      recentAudits,
      recentEnquiries,
    },
  });
};
