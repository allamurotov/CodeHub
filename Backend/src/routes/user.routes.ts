import { Router } from 'express';
import { listUsers, updateRole, deleteUser } from '../controllers/user.controller';
import { authenticate, authorizePermission } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', authorizePermission('MANAGE_USERS'), listUsers);
router.patch('/:id/role', authorizePermission('MANAGE_ADMINS'), updateRole);
router.delete('/:id', authorizePermission('MANAGE_USERS'), deleteUser);

export default router;
