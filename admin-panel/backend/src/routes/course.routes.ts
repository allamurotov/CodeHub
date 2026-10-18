import { Router } from 'express';
import {
  listAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/course.controller.js';
import { createLesson } from '../controllers/lesson.controller.js';
import { authenticate, authorizePermission } from '@codehub/shared/backend';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/admin', authorizePermission('MANAGE_CONTENT'), listAdminCourses);
router.post('/', authorizePermission('MANAGE_CONTENT'), upload.single('cover'), createCourse);
router.patch('/:id', authorizePermission('MANAGE_CONTENT'), upload.single('cover'), updateCourse);
router.delete('/:id', authorizePermission('MANAGE_CONTENT'), deleteCourse);

// Add lesson directly to course
router.post('/:courseId/lessons', authorizePermission('MANAGE_CONTENT'), upload.single('video'), createLesson);

export default router;
