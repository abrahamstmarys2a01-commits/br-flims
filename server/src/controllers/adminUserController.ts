import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AdminUser } from '../models/AdminUser.js';
import { AuthRequest } from '../middlewares/auth.js';
import { recordAuditLog } from '../services/auditService.js';

export const getAdminUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await AdminUser.find().sort({ createdAt: -1 }).select('-passwordHash').lean();
  res.status(200).json({
    success: true,
    data: users,
  });
};

export const createAdminUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  const existing = await AdminUser.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409).json({
      success: false,
      message: 'An administrator account with this email address already exists.',
    });
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await AdminUser.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    isActive: true,
  });

  await recordAuditLog({
    actorId: req.user?._id.toString(),
    actorEmail: req.user?.email || 'admin',
    action: 'ADMIN_USER_CREATED',
    entityType: 'AdminUser',
    entityId: newUser._id.toString(),
    details: { name: newUser.name, email: newUser.email, role: newUser.role },
    ipAddress: req.ip,
  });

  res.status(201).json({
    success: true,
    message: 'New administrator created successfully.',
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
    },
  });
};

export const updateAdminUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, role, isActive, password } = req.body;

  const targetUser = await AdminUser.findById(id);
  if (!targetUser) {
    res.status(404).json({
      success: false,
      message: 'Administrator account not found.',
    });
    return;
  }

  // Safety protection: Prevent deactivating or demoting the last active superadmin
  if (
    targetUser.role === 'superadmin' &&
    ((isActive === false) || (role && role !== 'superadmin'))
  ) {
    const superAdminCount = await AdminUser.countDocuments({
      role: 'superadmin',
      isActive: true,
    });
    if (superAdminCount <= 1) {
      res.status(400).json({
        success: false,
        message: 'Action blocked: The system requires at least one active Super Administrator.',
      });
      return;
    }
  }

  if (name !== undefined) targetUser.name = name;
  if (role !== undefined) targetUser.role = role;
  if (isActive !== undefined) targetUser.isActive = isActive;

  if (password) {
    const salt = await bcrypt.genSalt(12);
    targetUser.passwordHash = await bcrypt.hash(password, salt);
  }

  await targetUser.save();

  await recordAuditLog({
    actorId: req.user?._id.toString(),
    actorEmail: req.user?.email || 'admin',
    action: 'ADMIN_USER_UPDATED',
    entityType: 'AdminUser',
    entityId: id,
    details: { email: targetUser.email, role: targetUser.role, isActive: targetUser.isActive },
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: 'Administrator details updated successfully.',
    data: {
      id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      isActive: targetUser.isActive,
    },
  });
};

export const deleteAdminUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const targetUser = await AdminUser.findById(id);
  if (!targetUser) {
    res.status(404).json({
      success: false,
      message: 'Administrator not found.',
    });
    return;
  }

  // Prevent self-deletion
  if (req.user?._id.toString() === id) {
    res.status(400).json({
      success: false,
      message: 'You cannot delete your own active administrator account.',
    });
    return;
  }

  // Prevent deleting last superadmin
  if (targetUser.role === 'superadmin') {
    const superAdminCount = await AdminUser.countDocuments({
      role: 'superadmin',
      isActive: true,
    });
    if (superAdminCount <= 1) {
      res.status(400).json({
        success: false,
        message: 'Action blocked: Cannot delete the last active Super Administrator.',
      });
      return;
    }
  }

  await AdminUser.findByIdAndDelete(id);

  await recordAuditLog({
    actorId: req.user?._id.toString(),
    actorEmail: req.user?.email || 'admin',
    action: 'ADMIN_USER_DELETED',
    entityType: 'AdminUser',
    entityId: id,
    details: { email: targetUser.email },
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: `Administrator '${targetUser.email}' removed successfully.`,
  });
};
