import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";

const router = Router();

router.post("/", auth(UserRole.TENANT), rentalController.createRentalRequest);
router.get("/", auth(UserRole.TENANT), rentalController.getMyRentalRequests);
router.get(
  "/:id",
  auth(UserRole.TENANT),
  rentalController.getSingleRentalRequest,
);

router.get(
  "/landlord/requests",
  auth(UserRole.LANDLORD),
  rentalController.getLandlordRequests,
);

router.patch(
  "/landlord/requests/:id",
  auth(UserRole.LANDLORD),
  rentalController.updateRentalRequestStatus,
);

export const rentalRoutes = router;
