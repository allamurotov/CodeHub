import { Request, Response } from 'express';
import { db, successResponse, errorResponse, AuthenticatedRequest } from '@codehub/shared/backend';

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
