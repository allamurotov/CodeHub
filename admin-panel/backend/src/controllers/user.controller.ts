import { Response } from 'express';
import {
  db,
  successResponse,
  errorResponse,
  AuthenticatedRequest,
} from '@codehub/shared/backend';
import { Role } from '@codehub/shared/types';

export async function listUsers(req: AuthenticatedRequest, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);

  const allUsers = db.users.find().map(({ passwordHash, ...rest }) => rest);
  const total = allUsers.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const paginated = allUsers.slice(start, start + limit);

  return successResponse(res, 'Foydalanuvchilar ro\'yxati', {
    users: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

export async function updateRole(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { role, permissions } = req.body as { role: Role; permissions?: string[] };

  if (!role) {
    return errorResponse(res, 'Rol ko\'rsatilishi shart', 400);
  }

  const user = db.users.findById(id);
  if (!user) {
    return errorResponse(res, 'Foydalanuvchi topilmadi', 404);
  }

  // Prevent changing super admin if not authorized
  if (user.role === 'SUPER_ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
    return errorResponse(res, 'Super Admin ma\'lumotlarini o\'zgartirish huquqingiz yo\'q', 403);
  }

  const updated = db.users.update(id, {
    role,
    permissions: role === 'USER' ? [] : (permissions || []),
  });

  const { passwordHash, ...rest } = updated!;
  return successResponse(res, 'Foydalanuvchi roli yangilandi', rest);
}

export async function deleteUser(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  const target = db.users.findById(id);
  if (!target) {
    return errorResponse(res, 'Foydalanuvchi topilmadi', 404);
  }

  if (target.role === 'SUPER_ADMIN') {
    return errorResponse(res, 'Super Adminni o\'chirib bo\'lmaydi', 403);
  }

  if (target.id === req.user?.userId) {
    return errorResponse(res, 'O\'z hisobingizni o\'chira olmaysiz', 400);
  }

  db.users.delete(id);
  return successResponse(res, 'Foydalanuvchi muvaffaqiyatli o\'chirildi');
}
