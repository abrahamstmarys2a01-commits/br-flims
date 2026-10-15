import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { generalApiLimiter } from './middlewares/rateLimiter.js';
import apiRouter from './routes/index.js';
import { streamFromCluster } from './services/clusterStorageService.js';
import { initSystem } from './seed/initSystem.js';

const app = express();

// Trust proxy for secure cookie and rate limiter tracking
app.set('trust proxy', 1);

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Allows flexible inline resources & swagger
  })
);

// CORS configuration for separate public client and admin hosting
const configuredExtraOrigins = ENV.ALLOWED_ORIGINS
  ? ENV.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [];

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:5000',
  ENV.CLIENT_URL,
  ENV.ADMIN_URL,
  ...configuredExtraOrigins,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev, allow origins
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Parsers & Logging
app.use(cookieParser(ENV.COOKIE_SECRET));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 1. Direct streaming from MongoDB Atlas GridFS Cluster for media uploads
app.get('/uploads/cluster/:id/:filename?', async (req, res) => {
  const { id } = req.params;
  const etag = req.headers['if-none-match'] as string | undefined;
  const streamed = await streamFromCluster(id, res, etag);
  if (!streamed) {
    res.status(404).json({ success: false, message: 'Media not found in MongoDB cluster' });
  }
});

// 2. Stream by filename from cluster, or fallback to local static folder if present
app.get('/uploads/:folder/:filename', async (req, res, next) => {
  const { folder, filename } = req.params;
  const localPath = path.join(ENV.UPLOAD_DIR, folder, filename);

  // If local file exists, serve it
  if (fs.existsSync(localPath)) {
    return res.sendFile(localPath);
  }

  // Otherwise stream from MongoDB Atlas Cluster GridFS
  const etag = req.headers['if-none-match'] as string | undefined;
  const streamed = await streamFromCluster(filename, res, etag);
  if (!streamed) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }
});

// 3. Serve uploaded assets statically as fallback
app.use(
  '/uploads',
  express.static(ENV.UPLOAD_DIR, {
    maxAge: '1d',
    etag: true,
  })
);

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// General API Rate Limiting for API routes
app.use('/api', generalApiLimiter);

// Versioned API Router
app.use('/api/v1', apiRouter);

// Centralized Error Handling
app.use(errorHandler);

// Server initialization
export const startServer = async () => {
  try {
    await connectDB();

    // Baseline system initialization (creates Admin & baseline settings if empty, NO mock movies)
    await initSystem();

    const server = app.listen(ENV.PORT, () => {
      console.log(`====================================================`);
      console.log(`🎬 BR Films Cinema API Engine is Live on port ${ENV.PORT}`);
      console.log(`📄 Swagger Docs available at http://localhost:${ENV.PORT}/api/docs`);
      console.log(`🌐 API Base URL: http://localhost:${ENV.PORT}/api/v1`);
      console.log(`✅ MongoDB Connected: Connected to MongoDB Atlas cluster (brfilms)`);
      console.log(`====================================================`);
    });

    const shutdown = async () => {
      console.log('Shutting down server gracefully...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    return server;
  } catch (error) {
    console.error('Fatal startup error:', error);
    process.exit(1);
  }
};

// Auto start if executed directly
if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  startServer();
}

export default app;
