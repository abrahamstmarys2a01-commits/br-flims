import { Response } from 'express';
import { AuditLog } from '../models/AuditLog.js';
import { AuthRequest } from '../middlewares/auth.js';

export const getAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 25, 100);
  const skip = (page - 1) * limit;

  const { entityType, actorEmail } = req.query;
  const query: any = {};

  if (entityType && entityType !== 'all') {
    query.entityType = entityType;
  }

  if (actorEmail) {
    query.actorEmail = { $regex: actorEmail as string, $options: 'i' };
  }

  const [logs, total] = await Promise.all([
    AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
};
