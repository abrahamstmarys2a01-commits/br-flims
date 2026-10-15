import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';
import { ENV } from '../config/env.js';
import { AuthRequest } from '../middlewares/auth.js';
import { recordAuditLog } from '../services/auditService.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await AdminUser.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) {
    res.status(401).json({
      success: false,
      message: 'Invalid email address or password.',
    });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: 'Invalid email address or password.',
    });
    return;
  }

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // Create JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Set secure cookie
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  await recordAuditLog({
    actorId: user._id.toString(),
    actorEmail: user.email,
    action: 'ADMIN_LOGIN',
    entityType: 'AdminUser',
    entityId: user._id.toString(),
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: 'Signed in successfully.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
    },
  });
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.user) {
    await recordAuditLog({
      actorId: req.user._id.toString(),
      actorEmail: req.user.email,
      action: 'ADMIN_LOGOUT',
      entityType: 'AdminUser',
      entityId: req.user._id.toString(),
      ipAddress: req.ip,
    });
  }

  res.clearCookie('access_token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      lastLoginAt: req.user.lastLoginAt,
    },
  });
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const user = await AdminUser.findOne({ email: email.toLowerCase() });

  // For security, do not disclose whether user exists or not
  if (!user || !user.isActive) {
    res.status(200).json({
      success: true,
      message: 'If an active administrator account with that email exists, password reset instructions have been dispatched.',
    });
    return;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.resetPasswordToken = tokenHash;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const resetUrl = `${ENV.CLIENT_URL}/admin/reset-password?token=${rawToken}`;
  console.log(`[Password Reset] Generated reset link for ${user.email}: ${resetUrl}`);

  await recordAuditLog({
    actorEmail: user.email,
    action: 'FORGOT_PASSWORD_REQUEST',
    entityType: 'AdminUser',
    entityId: user._id.toString(),
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: 'If an active administrator account with that email exists, password reset instructions have been dispatched.',
    // Return token in non-production for frictionless testing
    ...(ENV.NODE_ENV !== 'production' ? { resetToken: rawToken, resetUrl } : {}),
  });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await AdminUser.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    res.status(400).json({
      success: false,
      message: 'Invalid or expired password reset token.',
    });
    return;
  }

  const salt = await bcrypt.genSalt(12);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  await recordAuditLog({
    actorId: user._id.toString(),
    actorEmail: user.email,
    action: 'PASSWORD_RESET_SUCCESS',
    entityType: 'AdminUser',
    entityId: user._id.toString(),
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: 'Your password has been successfully reset. You may now sign in with your new password.',
  });
};
