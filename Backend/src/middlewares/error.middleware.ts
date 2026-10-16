import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Unhandled Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Serverda kutilmagan xatolik yuz berdi';
  return errorResponse(res, message, status);
}
