import { Router } from 'express';
import { deleteLesson } from '../controllers/lesson.controller.js';
import { createMaterial } from '../controllers/material.controller.js';
import { authenticate, authorizePermission } from '@codehub/shared/backend';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.use(authenticate);

router.delete('/:id', authorizePermission('MANAGE_CONTENT'), deleteLesson);
router.post('/:lessonId/materials', authorizePermission('MANAGE_CONTENT'), upload.single('file'), createMaterial);

export default router;
