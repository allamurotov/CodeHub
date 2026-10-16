import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/db';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { Course } from '../types';

export async function listPublicCourses(req: Request, res: Response) {
  const courses = db.courses.find(true); // published only

  const formatted = courses.map((c) => {
    const lessons = db.lessons.findByCourseId(c.id);
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      coverImage: c.coverImage,
      createdAt: c.createdAt,
      _count: {
        lessons: lessons.length,
      },
    };
  });

  return successResponse(res, 'Kurslar ro\'yxati', { courses: formatted });
}

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

export async function listMyCourses(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return errorResponse(res, 'Avtorizatsiyadan o\'ting', 401);
  }

  const enrollments = db.enrollments.findByUser(req.user.userId);
  const courses = enrollments
    .map((e) => {
      const course = db.courses.findById(e.courseId);
      if (!course) return null;
      const lessons = db.lessons.findByCourseId(course.id);
      const userProgress = db.progress.findByUserAndCourse(req.user!.userId, course.id);
      const totalLessons = lessons.length;
      const completedLessons = userProgress.length;
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        id: course.id,
        title: course.title,
        coverImage: course.coverImage,
        totalLessons,
        completedLessons,
        progress,
      };
    })
    .filter(Boolean);

  return successResponse(res, 'Mening kurslarim', { courses });
}

export async function getCourseDetail(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const course = db.courses.findById(id);

  if (!course) {
    return errorResponse(res, 'Kurs topilmadi', 404);
  }

  const rawLessons = db.lessons.findByCourseId(course.id);
  const lessons = rawLessons.map((l) => ({
    ...l,
    materials: db.materials.findByLessonId(l.id),
  }));

  const userId = req.user?.userId;
  let isEnrolled = false;
  let completedLessonIds: string[] = [];

  if (userId) {
    const enrollment = db.enrollments.find(userId, course.id);
    isEnrolled = !!enrollment;
    const progressList = db.progress.findByUserAndCourse(userId, course.id);
    completedLessonIds = progressList.map((p) => p.lessonId);
  }

  return successResponse(res, 'Kurs tafsilotlari', {
    ...course,
    lessons,
    isEnrolled,
    completedLessonIds,
    _count: {
      lessons: lessons.length,
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

export async function enrollCourse(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return errorResponse(res, 'Avtorizatsiyadan o\'ting', 401);
  }

  const { id } = req.params;
  const course = db.courses.findById(id);
  if (!course) {
    return errorResponse(res, 'Kurs topilmadi', 404);
  }

  const record = db.enrollments.create(req.user.userId, course.id);
  return successResponse(res, 'Kursga muvaffaqiyatli a\'zo bo\'ldingiz', record);
}
