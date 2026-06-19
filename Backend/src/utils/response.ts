import { Response } from "express";
import { ApiResponse } from "../types";

export const sendSuccess = <T>(res: Response, message: string, data?: T, statusCode: number = 200): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, message: string, statusCode: number = 500, error?: string): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
  };
  res.status(statusCode).json(response);
};

export const asyncHandler = (fn: (req: any, res: Response, next: any) => Promise<any>) => {
  return (req: any, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
