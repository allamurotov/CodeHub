import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  db,
  successResponse,
  errorResponse,
  AuthenticatedRequest,
} from '@codehub/shared/backend';
import { Material } from '@codehub/shared/types';

export async function createMaterial(req: AuthenticatedRequest, res: Response) {
  const { lessonId } = req.params;
  const { title } = req.body;

  const lesson = db.lessons.findById(lessonId);
  if (!lesson) {
    return errorResponse(res, 'Dars topilmadi', 404);
  }

  if (!req.file) {
    return errorResponse(res, 'Fayl yuklanishi shart', 400);
  }

  const materialTitle = title || req.file.originalname;
  const fileUrl = `/uploads/materials/${req.file.filename}`;
  const fileType = req.file.mimetype;

  const newMaterial: Material = {
    id: `mat_${uuidv4()}`,
    lessonId,
    title: materialTitle,
    fileUrl,
    fileType,
    createdAt: new Date().toISOString(),
  };

  db.materials.create(newMaterial);
  return successResponse(res, 'Material muvaffaqiyatli qo\'shildi', newMaterial, 201);
}

export async function deleteMaterial(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const material = db.materials.findById(id);
  if (!material) {
    return errorResponse(res, 'Material topilmadi', 404);
  }

  db.materials.delete(id);
  return successResponse(res, 'Material o\'chirildi');
}
