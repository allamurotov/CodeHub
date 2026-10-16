import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import courseRoutes from './course.routes';
import lessonRoutes from './lesson.routes';
import materialRoutes from './material.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/lessons', lessonRoutes);
router.use('/materials', materialRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
