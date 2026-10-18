import { Router } from 'express';
import { toggleComplete } from '../controllers/lesson.controller.js';
import { authenticate } from '@codehub/shared/backend';

const router = Router();

router.post('/:id/complete', authenticate, toggleComplete);

export default router;
