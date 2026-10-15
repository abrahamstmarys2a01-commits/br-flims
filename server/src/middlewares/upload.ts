import multer from 'multer';
import { AppError } from './errorHandler.js';

// Memory storage engine so files can be piped directly into MongoDB Atlas GridFS Cluster
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG images are permitted.',
        400
      ) as any,
      false
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter,
});
