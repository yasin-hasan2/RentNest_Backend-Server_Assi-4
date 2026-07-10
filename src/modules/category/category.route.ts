import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", auth("ADMIN"), categoryController.createCategory);

router.get("/", categoryController.getAllCategories);

router.put("/:id", auth("ADMIN"), categoryController.updateCategory);

router.delete("/:id", auth("ADMIN"), categoryController.deleteCategory);

export const categoryRoutes = router;
