import mongoose from 'mongoose';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs';
import { Response } from 'express';
import { ENV } from '../config/env.js';

let gridfsBucket: mongoose.mongo.GridFSBucket | null = null;

/**
 * Access or create the GridFS bucket instance on the active MongoDB connection
 */
export const getGridFSBucket = (): mongoose.mongo.GridFSBucket => {
  if (!mongoose.connection.db) {
    throw new Error('[ClusterStorage] MongoDB connection is not active.');
  }
  if (!gridfsBucket) {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });
  }
  return gridfsBucket;
};

export interface ClusterFileResult {
  url: string;
  fileId: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Upload an image file directly to the MongoDB Atlas Cluster using GridFS
 */
export const uploadToCluster = async (
  file: Express.Multer.File,
  folderType: string = 'general'
): Promise<ClusterFileResult> => {
  const bucket = getGridFSBucket();

  // Create clean, web-friendly unique filename
  const ext = path.extname(file.originalname).toLowerCase();
  const safeBase = path
    .basename(file.originalname, ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-');
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  const storedFilename = `${safeBase}-${uniqueSuffix}${ext}`;

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(storedFilename, {
      contentType: file.mimetype,
      metadata: {
        folder: folderType,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date(),
      },
    });

    const fileId = uploadStream.id.toString();

    uploadStream.on('error', (err) => {
      console.error('[ClusterStorage] GridFS upload stream error:', err);
      reject(err);
    });

    uploadStream.on('finish', () => {
      console.log(`[ClusterStorage] Successfully stored image in MongoDB Atlas cluster: ${storedFilename} (${fileId})`);

      // Optionally write to local uploads directory as a local cache
      try {
        const localFolder = path.join(ENV.UPLOAD_DIR, folderType);
        if (!fs.existsSync(localFolder)) {
          fs.mkdirSync(localFolder, { recursive: true });
        }
        const localFilePath = path.join(localFolder, storedFilename);
        if (file.buffer) {
          fs.writeFileSync(localFilePath, file.buffer);
        } else if (file.path && fs.existsSync(file.path) && file.path !== localFilePath) {
          fs.copyFileSync(file.path, localFilePath);
        }
      } catch (cacheErr: any) {
        // Cache write is non-fatal; cluster is the source of truth
        console.warn('[ClusterStorage] Local cache write skipped:', cacheErr.message);
      }

      const clusterUrl = `/uploads/cluster/${fileId}/${storedFilename}`;
      resolve({
        url: clusterUrl,
        fileId,
        filename: storedFilename,
        size: file.size,
        mimeType: file.mimetype,
      });
    });

    // Provide content via buffer or disk file stream
    if (file.buffer) {
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    } else if (file.path && fs.existsSync(file.path)) {
      const fileStream = fs.createReadStream(file.path);
      fileStream.pipe(uploadStream);
    } else {
      reject(new Error('[ClusterStorage] No file buffer or path provided.'));
    }
  });
};

/**
 * Stream an image stored in MongoDB Atlas GridFS back to the client response
 */
export const streamFromCluster = async (
  identifier: string,
  res: Response,
  reqEtag?: string
): Promise<boolean> => {
  try {
    const bucket = getGridFSBucket();
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

    let fileDoc: any = null;
    let objectId: mongoose.Types.ObjectId;

    if (isObjectId) {
      objectId = new mongoose.Types.ObjectId(identifier);
      const files = await bucket.find({ _id: objectId }).limit(1).toArray();
      fileDoc = files[0];
    } else {
      const files = await bucket.find({ filename: identifier }).sort({ uploadDate: -1 }).limit(1).toArray();
      fileDoc = files[0];
      if (fileDoc) {
        objectId = fileDoc._id;
      }
    }

    if (!fileDoc) {
      return false;
    }

    const etag = `"${fileDoc._id.toString()}"`;
    if (reqEtag && reqEtag === etag) {
      res.status(304).end();
      return true;
    }

    const mimeType =
      fileDoc.contentType ||
      fileDoc.metadata?.mimeType ||
      'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', fileDoc.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('ETag', etag);

    const downloadStream = bucket.openDownloadStream(fileDoc._id);
    downloadStream.on('error', (err) => {
      console.error('[ClusterStorage] Download stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Error streaming file from database cluster' });
      }
    });

    downloadStream.pipe(res);
    return true;
  } catch (err: any) {
    console.error('[ClusterStorage] Error fetching file from cluster:', err.message);
    return false;
  }
};

/**
 * Remove an image from the MongoDB Atlas GridFS cluster
 */
export const deleteFromCluster = async (urlOrId: string): Promise<boolean> => {
  try {
    const bucket = getGridFSBucket();
    let idString = urlOrId;

    // Extract ID if URL is passed (e.g. /uploads/cluster/60d.../image.png)
    const match = urlOrId.match(/\/uploads\/cluster\/([0-9a-fA-F]{24})/);
    if (match) {
      idString = match[1];
    }

    if (/^[0-9a-fA-F]{24}$/.test(idString)) {
      await bucket.delete(new mongoose.Types.ObjectId(idString));
      console.log(`[ClusterStorage] Deleted file from MongoDB cluster: ${idString}`);
      return true;
    }
    return false;
  } catch (err: any) {
    console.warn(`[ClusterStorage] Failed to delete file ${urlOrId}:`, err.message);
    return false;
  }
};

/**
 * Ensure default static assets (such as company logo) are uploaded into the MongoDB Atlas cluster
 */
export const syncDefaultAssetsToCluster = async (): Promise<void> => {
  try {
    const bucket = getGridFSBucket();
    const defaultLogoPath = path.join(ENV.UPLOAD_DIR, 'logos', 'br-films-logo.png');

    if (fs.existsSync(defaultLogoPath)) {
      const existing = await bucket.find({ filename: 'br-films-logo.png' }).limit(1).toArray();
      if (!existing || existing.length === 0) {
        const stats = fs.statSync(defaultLogoPath);
        const uploadStream = bucket.openUploadStream('br-films-logo.png', {
          contentType: 'image/png',
          metadata: {
            folder: 'logos',
            originalName: 'br-films-logo.png',
            size: stats.size,
            mimeType: 'image/png',
            isSystemAsset: true,
            uploadedAt: new Date(),
          },
        });

        fs.createReadStream(defaultLogoPath).pipe(uploadStream);
        uploadStream.on('finish', () => {
          console.log('[ClusterStorage] Synced official BR Films logo to MongoDB Atlas cluster storage.');
        });
      }
    }
  } catch (err: any) {
    console.warn('[ClusterStorage] Asset sync notice:', err.message);
  }
};
