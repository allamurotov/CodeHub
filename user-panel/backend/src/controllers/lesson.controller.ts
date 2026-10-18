import { Response } from 'express';
import { db, successResponse, errorResponse, AuthenticatedRequest } from '@codehub/shared/backend';

export async function toggleComplete(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return errorResponse(res, 'Avtorizatsiyadan o\'ting', 401);
  }

  const { id } = req.params;
  const lesson = db.lessons.findById(id);
  if (!lesson) {
    return errorResponse(res, 'Dars topilmadi', 404);
  }

  const isCompleted = db.progress.toggleComplete(req.user.userId, id);
  return successResponse(res, isCompleted ? 'Dars yakunlandi' : 'Dars yakunlanmagan holatga o\'tkazildi', {
    isCompleted,
  });
}
