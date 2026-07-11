import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/client";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/all-users", auth(UserRole.ADMIN), adminController.getAllUsers);

router.patch(
  "/user/:id",
  auth(UserRole.ADMIN),
  adminController.updateUserStatus,
);

router.get(
  "/properties",
  auth(UserRole.ADMIN),
  adminController.getAllPropertiesForAdmin,
);

router.get(
  "/rentals",
  auth(UserRole.ADMIN),
  adminController.getAllRentalsForAdmin,
);

export const adminRoute = router;
