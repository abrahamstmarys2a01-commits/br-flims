import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env with override: true (parent first, then server/.env with highest priority)
const possibleEnvPaths = [
  path.resolve(process.cwd(), '..', '.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server', '.env'),
];
possibleEnvPaths.forEach((p) => {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p, override: true });
  }
});
dotenv.config({ override: true });

// Determine workspace root containing uploads folder
const determineUploadDir = (): string => {
  if (process.env.UPLOAD_DIR) return process.env.UPLOAD_DIR;
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'uploads'))) {
    return path.join(cwd, 'uploads');
  }
  if (fs.existsSync(path.join(cwd, '..', 'uploads'))) {
    return path.join(cwd, '..', 'uploads');
  }
  return path.resolve(cwd, 'uploads');
};

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:5174',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || '',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brfilms',
  JWT_SECRET: process.env.JWT_SECRET || 'brfilms_super_secure_jwt_secret_key_2026_cinema',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'brfilms_cookie_secret_key_2026',
  
  // Cloudinary credentials (optional - local file upload fallback available)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  // SMTP / Email notification configuration (optional)
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  NOTIFY_EMAIL: process.env.NOTIFY_EMAIL || 'contact@brfilms.in',
  
  // Media Storage Type: 'cluster' (MongoDB GridFS in Atlas), 'local', or 'cloudinary'
  MEDIA_STORE_TYPE: process.env.MEDIA_STORE_TYPE || 'cluster',

  // Uploads directory path
  UPLOAD_DIR: determineUploadDir(),
};

