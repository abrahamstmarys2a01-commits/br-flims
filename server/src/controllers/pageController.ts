import { Request, Response } from 'express';
import { WebsitePage } from '../models/WebsitePage.js';
import { AuthRequest } from '../middlewares/auth.js';
import { recordAuditLog } from '../services/auditService.js';

export const getPublicPageBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  const page = await WebsitePage.findOne({
    slug: slug.toLowerCase(),
    isPublished: true,
  }).lean();

  if (!page) {
    res.status(404).json({
      success: false,
      message: `Page '${slug}' not found.`,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: page,
  });
};

export const getAdminPages = async (_req: AuthRequest, res: Response): Promise<void> => {
  const pages = await WebsitePage.find().sort({ title: 1 }).lean();
  res.status(200).json({
    success: true,
    data: pages,
  });
};

export const getAdminPageById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const page = await WebsitePage.findById(id).lean();

  if (!page) {
    res.status(404).json({
      success: false,
      message: 'Page not found.',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: page,
  });
};

export const updateAdminPage = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const page = await WebsitePage.findByIdAndUpdate(
    id,
    {
      $set: {
        ...req.body,
        lastUpdatedBy: req.user?.email || 'admin',
      },
    },
    { new: true, runValidators: true }
  );

  if (!page) {
    res.status(404).json({
      success: false,
      message: 'Page not found.',
    });
    return;
  }

  await recordAuditLog({
    actorId: req.user?._id.toString(),
    actorEmail: req.user?.email || 'admin',
    action: 'PAGE_UPDATED',
    entityType: 'WebsitePage',
    entityId: id,
    details: { slug: page.slug, title: page.title },
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: 'Page updated successfully in database.',
    data: page,
  });
};
