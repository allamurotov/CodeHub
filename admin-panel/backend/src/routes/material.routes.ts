import { Router } from 'express';
import { deleteMaterial } from '../controllers/material.controller.js';
import { authenticate, authorizePermission } from '@codehub/shared/backend';

const router = Router();

router.use(authenticate);

router.delete('/:id', authorizePermission('MANAGE_CONTENT'), deleteMaterial);

export default router;
