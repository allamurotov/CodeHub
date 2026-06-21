import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, userController.getAll as any);
router.get("/:id", authenticate, userController.getById as any);
router.patch("/me", authenticate, userController.update as any);
router.delete("/me", authenticate, userController.delete as any);

export default router;
