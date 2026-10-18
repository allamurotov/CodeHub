import { Router } from 'express';
import { createAuthRouter } from '@codehub/shared/backend';

const router = Router();

// Only ADMIN and SUPER_ADMIN roles are allowed to login
router.use('/', createAuthRouter(['ADMIN', 'SUPER_ADMIN']));

export default router;
