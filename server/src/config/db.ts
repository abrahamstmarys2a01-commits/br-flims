import mongoose from 'mongoose';
import dns from 'dns';
import { ENV } from './env.js';

let mongodInstance: any = null;

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);

    const isRemoteAtlas = ENV.MONGODB_URI.includes('mongodb+srv://') || ENV.MONGODB_URI.includes('cluster');
    const safeHost = ENV.MONGODB_URI.includes('@') ? ENV.MONGODB_URI.split('@').pop() : 'cluster';

    // Fix for Windows / local ISP DNS resolution issues with mongodb+srv SRV records
    if (isRemoteAtlas) {
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
      } catch (dnsErr) {
        // Fallback silently if custom DNS servers cannot be set
      }
    }

    console.log(`[Database] Connecting to MongoDB Atlas cluster (${safeHost})...`);

    // Direct connection to configured URI
    await mongoose.connect(ENV.MONGODB_URI, {
      dbName: 'brfilms',
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[Database] ✅ MongoDB Connected: Successfully connected to MongoDB Atlas cluster at ${safeHost} (db: brfilms)`);
  } catch (err: any) {
    const isRemoteAtlas = ENV.MONGODB_URI.includes('mongodb+srv://') || ENV.MONGODB_URI.includes('cluster');
    if (isRemoteAtlas) {
      console.error(`[Database] ❌ Critical error connecting to MongoDB Atlas (${err.message}). Please check IP access and cluster state.`);
      throw err;
    }

    if (ENV.NODE_ENV !== 'production') {
      console.warn(`[Database] Direct MongoDB connection failed (${err.message}). Starting embedded in-memory MongoDB for zero-config development...`);
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const memUri = mongodInstance.getUri();
        await mongoose.connect(memUri);
        console.log(`[Database] Connected successfully to in-memory MongoDB instance: ${memUri}`);
      } catch (memErr: any) {
        console.error('[Database] In-memory MongoDB startup failed:', memErr.message);
        throw memErr;
      }
    } else {
      console.error('[Database] Failed to connect to MongoDB in production:', err);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
    console.log('[Database] Disconnected MongoDB gracefully.');
  } catch (err: any) {
    console.error('[Database] Disconnect error:', err.message);
  }
};
