import { Router } from 'express';
import { createAuthRouter } from '@codehub/shared/backend';
import { register, oauthHandler } from '../controllers/auth.controller.js';

const router = Router();

// Mount shared auth (login, refresh, profile, logout)
router.use('/', createAuthRouter());

// User panel specific auth
router.post('/register', register);
router.get('/:provider(google|github)', oauthHandler);

export default router;
