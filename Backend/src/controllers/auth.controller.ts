import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response";
import { env } from "../config/env";

const DEV_PROFILES: Record<string, { name: string; email: string; avatar: string }> = {
  google: { name: "Dev User (Google)", email: "dev.google@codehub.dev", avatar: "" },
  github: { name: "Dev User (GitHub)", email: "dev.github@codehub.dev", avatar: "" },
};

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

  async profile(req: Request, res: Response) {
    const payload = (req as any).user;
    const user = await authService.getProfile(payload.userId);
    sendSuccess(res, "Profile fetched", user);
  },

  async googleCallback(req: Request, res: Response) {
    const profile = (req as any).user;
    if (!profile) {
      return sendError(res, "OAuth failed", 401);
    }
    const result = await authService.oauthLogin(profile);
    res.send(oauthSuccessHtml(result.accessToken, result.refreshToken));
  },

  async githubCallback(req: Request, res: Response) {
    const profile = (req as any).user;
    if (!profile) {
      return sendError(res, "OAuth failed", 401);
    }
    const result = await authService.oauthLogin(profile);
    res.send(oauthSuccessHtml(result.accessToken, result.refreshToken));
  },

  async mockGoogle(_req: Request, res: Response) {
    const profile = DEV_PROFILES.google;
    const result = await authService.oauthLogin({
      provider: "google",
      providerId: `dev_google_${Date.now()}`,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
    });
    res.send(oauthSuccessHtml(result.accessToken, result.refreshToken));
  },

  async mockGithub(_req: Request, res: Response) {
    const profile = DEV_PROFILES.github;
    const result = await authService.oauthLogin({
      provider: "github",
      providerId: `dev_github_${Date.now()}`,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
    });
    res.send(oauthSuccessHtml(result.accessToken, result.refreshToken));
  },
};

function oauthSuccessHtml(accessToken: string, refreshToken: string) {
  return `<!DOCTYPE html>
<html>
<body>
<script>
  window.opener.postMessage(
    { type: "OAUTH_SUCCESS", accessToken: "${accessToken}", refreshToken: "${refreshToken}" },
    "${env.clientUrl}"
  );
  window.close();
</script>
</body>
</html>`;
}
