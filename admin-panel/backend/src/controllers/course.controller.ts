import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  db,
  successResponse,
  errorResponse,
  AuthenticatedRequest,
} from '@codehub/shared/backend';
import { Course } from '@codehub/shared/types';

export async function listAdminCourses(req: AuthenticatedRequest, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 50);

  const allCourses = db.courses.find(false); // all courses
  const total = allCourses.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;

  const paginated = allCourses.slice(start, start + limit).map((c) => {
    const lessons = db.lessons.findByCourseId(c.id);
    return {
      ...c,
      _count: {
        lessons: lessons.length,
      },
    };
  });

  return successResponse(res, 'Admin kurslar ro\'yxati', {
    courses: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

export async function createCourse(req: AuthenticatedRequest, res: Response) {
  const { title, description, published } = req.body;

  if (!title) {
    return errorResponse(res, 'Kurs nomi kiritilishi shart', 400);
  }

  let coverImage: string | null = null;
  if (req.file) {
    coverImage = `/uploads/covers/${req.file.filename}`;
  }

  const newCourse: Course = {
    id: `crs_${uuidv4()}`,
    title,
    description: description || '',
    coverImage,
    published: published === 'true' || published === true,
    createdAt: new Date().toISOString(),
  };

  db.courses.create(newCourse);
  return successResponse(res, 'Kurs yaratildi', newCourse, 201);
}

export async function updateCourse(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { title, description, published } = req.body;

  const course = db.courses.findById(id);
  if (!course) {
    return errorResponse(res, 'Kurs topilmadi', 404);
  }

  const updates: Partial<Course> = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (published !== undefined) updates.published = published === 'true' || published === true;
  if (req.file) {
    updates.coverImage = `/uploads/covers/${req.file.filename}`;
  }

  const updated = db.courses.update(id, updates);
  return successResponse(res, 'Kurs yangilandi', updated);
}

export async function deleteCourse(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const course = db.courses.findById(id);
  if (!course) {
    return errorResponse(res, 'Kurs topilmadi', 404);
  }

  db.courses.delete(id);
  return successResponse(res, 'Kurs o\'chirildi');
}
