import { Router } from "express";

import { propertyController } from "./property.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth("LANDLORD"), propertyController.createProperty);
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getSingleProperty);
router.put("/:id", auth(UserRole.LANDLORD), propertyController.updateProperty);
router.delete(
  "/:id",
  auth(UserRole.LANDLORD),
  propertyController.deleteProperty,
);

export const propertyRoutes = router;
