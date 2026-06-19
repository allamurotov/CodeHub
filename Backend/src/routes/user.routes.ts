import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, userController.getAll);
router.get("/:id", authenticate, userController.getById);
router.patch("/me", authenticate, userController.update);
router.delete("/me", authenticate, userController.delete);

export default router;
