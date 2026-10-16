import { Router } from 'express';
import { deleteMaterial } from '../controllers/material.controller';
import { authenticate, authorizePermission } from '../middlewares/auth.middleware';

const router = Router();

router.delete('/:id', authenticate, authorizePermission('MANAGE_CONTENT'), deleteMaterial);

export default router;
