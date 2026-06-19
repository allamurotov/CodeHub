import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { sendSuccess } from "../utils/response";
import { AuthRequest } from "../types";

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    sendSuccess(res, "Registration successful", result, 201);
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    sendSuccess(res, "Login successful", result);
  },

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const tokens = await authService.refresh(refreshToken);
    sendSuccess(res, "Tokens refreshed", tokens);
  },

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    sendSuccess(res, "Logout successful");
  },

  async profile(req: AuthRequest, res: Response) {
    const user = await authService.getProfile(req.user!.userId);
    sendSuccess(res, "Profile fetched", user);
  },
};
