import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { sendError } from "../utils/response";
import { ZodError } from "zod";
import { MulterError } from "multer";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    sendError(res, message, 400, "VALIDATION_ERROR");
    return;
  }

  if (err instanceof MulterError) {
    sendError(res, err.message, 400, "UPLOAD_ERROR");
    return;
  }

  if (err.message?.startsWith("Ruxsat etilmagan fayl turi")) {
    sendError(res, err.message, 400, "UPLOAD_ERROR");
    return;
  }

  console.error("Unhandled error:", err);
  sendError(res, "Internal server error", 500, "INTERNAL_ERROR");
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  sendError(res, "Route not found", 404);
};
