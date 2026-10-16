import { Router } from 'express';
import { deleteLesson, toggleComplete } from '../controllers/lesson.controller';
import { createMaterial } from '../controllers/material.controller';
import { authenticate, authorizePermission } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.post('/:id/complete', authenticate, toggleComplete);
router.delete('/:id', authenticate, authorizePermission('MANAGE_CONTENT'), deleteLesson);
router.post('/:lessonId/materials', authenticate, authorizePermission('MANAGE_CONTENT'), upload.single('file'), createMaterial);

export default router;
