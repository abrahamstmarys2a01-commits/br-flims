import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  actorId?: string;
  actorEmail: string;
  action: string; // e.g. 'MOVIE_CREATED', 'MOVIE_UPDATED', 'ENQUIRY_STATUS_CHANGED', 'SETTINGS_UPDATED', 'USER_LOGIN'
  entityType: string; // e.g. 'Movie', 'Enquiry', 'SiteSetting', 'AdminUser'
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: {
      type: String,
      trim: true,
    },
    actorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    entityId: {
      type: String,
      trim: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
