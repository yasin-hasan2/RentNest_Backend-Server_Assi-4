import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

// Admin only
router.post("/", auth("ADMIN"), categoryController.createCategory);

// Public
router.get("/", categoryController.getAllCategories);

export const categoryRoutes = router;
