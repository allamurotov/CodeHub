import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";
import courseRoutes from "./course.routes";
import lessonRoutes from "./lesson.routes";
import materialRoutes from "./material.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/courses", courseRoutes);
router.use("/lessons", lessonRoutes);
router.use("/materials", materialRoutes);

export default router;
