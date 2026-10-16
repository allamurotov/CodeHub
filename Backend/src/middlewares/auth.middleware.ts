import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { errorResponse } from '../utils/response';
import { AuthTokenPayload, Role } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Token topilmadi yoki yaroqsiz', 401);
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    return errorResponse(res, 'Token muddati tugagan yoki xato', 401);
  }

  req.user = payload;
  next();
}

export function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}

export function authorizeRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, 'Avtorizatsiyadan o\'ting', 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Ruxsat berilmagan', 403);
    }
    next();
  };
}

export function authorizePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, 'Avtorizatsiyadan o\'ting', 401);
    }
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }
    if (!req.user.permissions.includes(permission)) {
      return errorResponse(res, 'Ushbu amal uchun ruxsat berilmagan', 403);
    }
    next();
  };
}
