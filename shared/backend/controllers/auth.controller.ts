import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../models/db.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { User, Role } from '../../types/index.js';

export function cleanUser(user: User) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export async function loginWithRoles(req: Request, res: Response, allowedRoles?: Role[]) {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 'Email va parolni kiriting', 400);
  }

  const user = db.users.findByEmail(email);
  if (!user) {
    return errorResponse(res, 'Email yoki parol noto\'g\'ri', 401);
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return errorResponse(res, 'Email yoki parol noto\'g\'ri', 401);
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return errorResponse(res, 'Ushbu panelga kirish huquqingiz yo\'q', 403);
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  db.refreshTokens.save(user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

  return successResponse(res, 'Tizimga muvaffaqiyatli kirdingiz', {
    user: cleanUser(user),
    accessToken,
    refreshToken,
  });
}

export async function login(req: Request, res: Response) {
  return loginWithRoles(req, res);
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return errorResponse(res, 'Refresh token taqdim etilmadi', 400);
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return errorResponse(res, 'Yaroqsiz yoki muddati o\'tgan refresh token', 401);
  }

  const saved = db.refreshTokens.find(refreshToken);
  if (!saved) {
    return errorResponse(res, 'Refresh token bekor qilingan', 401);
  }

  const user = db.users.findById(payload.userId);
  if (!user) {
    return errorResponse(res, 'Foydalanuvchi topilmadi', 404);
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
  };

  const newAccessToken = signAccessToken(tokenPayload);
  const newRefreshToken = signRefreshToken(tokenPayload);

  db.refreshTokens.remove(refreshToken);
  db.refreshTokens.save(user.id, newRefreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

  return successResponse(res, 'Token muvaffaqiyatli yangilandi', {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
}

export async function profile(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return errorResponse(res, 'Avtorizatsiyadan o\'ting', 401);
  }

  const user = db.users.findById(req.user.userId);
  if (!user) {
    return errorResponse(res, 'Foydalanuvchi topilmadi', 404);
  }

  return successResponse(res, 'Profil ma\'lumotlari', cleanUser(user));
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (refreshToken) {
    db.refreshTokens.remove(refreshToken);
  }
  return successResponse(res, 'Tizimdan muvaffaqiyatli chiqildi');
}
