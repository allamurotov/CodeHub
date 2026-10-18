import { Router } from 'express';
import {
  listPublicCourses,
  listMyCourses,
  getCourseDetail,
  enrollCourse,
} from '../controllers/course.controller.js';
import { authenticate, optionalAuthenticate } from '@codehub/shared/backend';

const router = Router();

router.get('/', listPublicCourses);
router.get('/my', authenticate, listMyCourses);
router.get('/:id', optionalAuthenticate, getCourseDetail);
router.post('/:id/enroll', authenticate, enrollCourse);

export default router;
