import { AuditLog } from '../models/AuditLog.js';

export interface RecordAuditOptions {
  actorId?: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

export const recordAuditLog = async (options: RecordAuditOptions): Promise<void> => {
  try {
    // Sanitize sensitive fields from details before logging
    const safeDetails = { ...options.details };
    delete safeDetails.password;
    delete safeDetails.passwordHash;
    delete safeDetails.token;
    delete safeDetails.secret;

    await AuditLog.create({
      actorId: options.actorId,
      actorEmail: options.actorEmail,
      action: options.action,
      entityType: options.entityType,
      entityId: options.entityId,
      details: safeDetails,
      ipAddress: options.ipAddress,
    });
  } catch (err: any) {
    console.error('[AuditLog] Failed to record audit log:', err.message);
  }
};
