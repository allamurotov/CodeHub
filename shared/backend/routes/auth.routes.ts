import { Router } from 'express';
import { login, loginWithRoles, refresh, profile, logout } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { Role } from '../../types/index.js';

export function createAuthRouter(allowedRoles?: Role[]): Router {
  const router = Router();
  if (allowedRoles && allowedRoles.length > 0) {
    router.post('/login', (req, res) => loginWithRoles(req, res, allowedRoles));
  } else {
    router.post('/login', login);
  }
  router.post('/refresh', refresh);
  router.get('/profile', authenticate, profile);
  router.post('/logout', logout);
  return router;
}

export const authRouter = createAuthRouter();
export default authRouter;
