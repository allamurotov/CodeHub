import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/db';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { Lesson } from '../types';

export async function createLesson(req: AuthenticatedRequest, res: Response) {
  const { courseId } = req.params;
  const { title, description } = req.body;

  const course = db.courses.findById(courseId);
  if (!course) {
    return errorResponse(res, 'Kurs topilmadi', 404);
  }

  if (!title) {
    return errorResponse(res, 'Dars nomini kiriting', 400);
  }

  let videoUrl: string | null = null;
  if (req.file) {
    videoUrl = `/uploads/videos/${req.file.filename}`;
  }

  const existingLessons = db.lessons.findByCourseId(courseId);
  const nextOrder = existingLessons.length + 1;

  const newLesson: Lesson = {
    id: `lsn_${uuidv4()}`,
    courseId,
    title,
    description: description || '',
    videoUrl,
    order: nextOrder,
    createdAt: new Date().toISOString(),
  };

  db.lessons.create(newLesson);
  return successResponse(res, 'Dars qo\'shildi', newLesson, 201);
}

export async function deleteLesson(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const lesson = db.lessons.findById(id);
  if (!lesson) {
    return errorResponse(res, 'Dars topilmadi', 404);
  }

  db.lessons.delete(id);
  return successResponse(res, 'Dars o\'chirildi');
}

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
