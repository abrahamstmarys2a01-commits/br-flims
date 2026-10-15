import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { AdminUser, IAdminUser } from '../models/AdminUser.js';

export interface AuthRequest extends Request {
  user?: IAdminUser;
}

export const authenticateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to access this resource.',
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; email: string };
    const user = await AdminUser.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User session is invalid or user account has been deactivated.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session. Please sign in again.',
    });
  }
};
