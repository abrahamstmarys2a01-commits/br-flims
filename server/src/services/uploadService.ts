import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env.js';
import {
  uploadToCluster,
  deleteFromCluster,
  ClusterFileResult,
} from './clusterStorageService.js';

// Initialize Cloudinary if credentials are provided
if (ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
  });
  console.log('[Media] Cloudinary configured successfully.');
} else {
  console.log(
    `[Media] Operating with '${ENV.MEDIA_STORE_TYPE}' media storage (MongoDB Atlas Cluster GridFS).`
  );
}

export interface UploadResult {
  url: string;
  publicId?: string;
  fileId?: string;
  filename: string;
  size: number;
  mimeType: string;
}

export const processUploadedFile = async (
  file: Express.Multer.File,
  folderType: string = 'general'
): Promise<UploadResult> => {
  // 1. If Cluster mode is active (default and requested), upload directly to MongoDB Atlas GridFS
  if (ENV.MEDIA_STORE_TYPE === 'cluster') {
    try {
      const clusterResult: ClusterFileResult = await uploadToCluster(file, folderType);
      return {
        url: clusterResult.url,
        fileId: clusterResult.fileId,
        filename: clusterResult.filename,
        size: clusterResult.size,
        mimeType: clusterResult.mimeType,
      };
    } catch (clusterErr: any) {
      console.error(
        '[UploadService] Cluster upload failed, falling back to local storage:',
        clusterErr.message
      );
    }
  }

  // 2. Cloudinary check
  const isCloudinaryActive = Boolean(
    ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET
  );

  if (isCloudinaryActive && file.path) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(file.path, {
        folder: `br_films/${folderType}`,
        resource_type: 'image',
      });

      // Cleanup local temp file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        filename: file.filename || path.basename(file.originalname),
        size: file.size,
        mimeType: file.mimetype,
      };
    } catch (err: any) {
      console.error('[UploadService] Cloudinary upload failed:', err.message);
    }
  }

  // 3. Fallback to local storage
  let relativeFolder = 'general';
  if (['movies', 'posters'].includes(folderType.toLowerCase())) {
    relativeFolder = 'movies';
  } else if (folderType.toLowerCase() === 'banners') {
    relativeFolder = 'banners';
  } else if (folderType.toLowerCase() === 'logos') {
    relativeFolder = 'logos';
  }

  const filename = file.filename || `${Date.now()}-${file.originalname}`;
  const localUrl = `/uploads/${relativeFolder}/${filename}`;
  return {
    url: localUrl,
    filename: filename,
    size: file.size,
    mimeType: file.mimetype,
  };
};

export const deleteUploadedFile = async (fileUrl: string, publicId?: string): Promise<void> => {
  try {
    // 1. Check if it's a cluster media URL
    if (fileUrl.includes('/uploads/cluster/')) {
      await deleteFromCluster(fileUrl);
    }

    // 2. Cloudinary cleanup
    if (publicId && ENV.CLOUDINARY_CLOUD_NAME) {
      await cloudinary.uploader.destroy(publicId);
      return;
    }

    // 3. Local file cleanup
    if (fileUrl.startsWith('/uploads/')) {
      const relativePart = fileUrl.replace('/uploads/', '');
      const fullPath = path.join(ENV.UPLOAD_DIR, relativePart);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
  } catch (err: any) {
    console.error('[UploadService] Error during media removal:', err.message);
  }
};
