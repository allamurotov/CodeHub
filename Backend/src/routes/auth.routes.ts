import { Router, Request, Response } from "express";
import passport from "passport";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../validators";
import { env } from "../config/env";

const router = Router();

router.post("/register", validate(registerSchema), authController.register as any);
router.post("/login", validate(loginSchema), authController.login as any);
router.post("/refresh", authController.refresh as any);
router.post("/logout", authController.logout as any);
router.get("/profile", authenticate, authController.profile as any);

if (env.googleClientId && env.googleClientSecret) {
  router.get("/google", passport.authenticate("google", { scope: ["email", "profile"], session: false }));
  router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/" }), authController.googleCallback as any);
} else {
  router.get("/google", authController.mockGoogle as any);
  router.get("/google/callback", authController.mockGoogle as any);
}

if (env.githubClientId && env.githubClientSecret) {
  router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }));
  router.get("/github/callback", passport.authenticate("github", { session: false, failureRedirect: "/" }), authController.githubCallback as any);
} else {
  router.get("/github", authController.mockGithub as any);
  router.get("/github/callback", authController.mockGithub as any);
}

export default router;
