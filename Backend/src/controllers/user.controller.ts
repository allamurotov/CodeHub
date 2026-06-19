import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { sendSuccess } from "../utils/response";
import { AuthRequest } from "../types";

export const userController = {
  async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await userService.getAll(page, limit);
    sendSuccess(res, "Users fetched", result);
  },

  async getById(req: Request, res: Response) {
    const user = await userService.getById(req.params.id);
    sendSuccess(res, "User fetched", user);
  },

  async update(req: AuthRequest, res: Response) {
    const user = await userService.update(req.user!.userId, req.body);
    sendSuccess(res, "Profile updated", user);
  },

  async delete(req: AuthRequest, res: Response) {
    await userService.delete(req.user!.userId);
    sendSuccess(res, "Account deleted");
  },
};
