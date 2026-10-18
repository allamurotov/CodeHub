import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import courseRoutes from './course.routes.js';
import lessonRoutes from './lesson.routes.js';
import materialRoutes from './material.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/lessons', lessonRoutes);
router.use('/materials', materialRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'admin-panel-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
