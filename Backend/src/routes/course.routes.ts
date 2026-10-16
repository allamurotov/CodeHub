import { Router } from 'express';
import {
  listPublicCourses,
  listAdminCourses,
  listMyCourses,
  getCourseDetail,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
} from '../controllers/course.controller';
import { createLesson } from '../controllers/lesson.controller';
import { authenticate, optionalAuthenticate, authorizePermission } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Public / User routes
router.get('/', listPublicCourses);
router.get('/my', authenticate, listMyCourses);
router.get('/admin', authenticate, authorizePermission('MANAGE_CONTENT'), listAdminCourses);
router.get('/:id', optionalAuthenticate, getCourseDetail);
router.post('/:id/enroll', authenticate, enrollCourse);

// Admin Content Management routes
router.post('/', authenticate, authorizePermission('MANAGE_CONTENT'), upload.single('cover'), createCourse);
router.patch('/:id', authenticate, authorizePermission('MANAGE_CONTENT'), upload.single('cover'), updateCourse);
router.delete('/:id', authenticate, authorizePermission('MANAGE_CONTENT'), deleteCourse);

// Lesson addition for course
router.post('/:courseId/lessons', authenticate, authorizePermission('MANAGE_CONTENT'), upload.single('video'), createLesson);

export default router;
