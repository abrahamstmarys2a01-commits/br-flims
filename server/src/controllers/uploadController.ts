import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { processUploadedFile } from '../services/uploadService.js';
import { recordAuditLog } from '../services/auditService.js';

export const handleSingleUpload = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      message: 'No file received. Please attach an image file.',
    });
    return;
  }

  const folder = (req.body.folder as string) || 'general';
  const result = await processUploadedFile(req.file, folder);

  await recordAuditLog({
    actorId: req.user?._id.toString(),
    actorEmail: req.user?.email || 'admin',
    action: 'MEDIA_UPLOADED',
    entityType: 'Media',
    details: { url: result.url, folder, size: result.size, mimeType: result.mimeType },
    ipAddress: req.ip,
  });

  res.status(201).json({
    success: true,
    message: 'Image uploaded successfully.',
    data: result,
  });
};
