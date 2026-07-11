import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { rentalService } from "./rental.service";

const createRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user!.id;

    const rental = await rentalService.createRentalRequestIntoDB(
      tenantId,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental request submitted successfully",
      data: rental,
    });
  },
);

const getMyRentalRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user!.id;

    const result = await rentalService.getMyRentalRequestsFromDB(tenantId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully",
      data: result,
    });
  },
);

const getSingleRentalRequest = catchAsync(
  async (req: Request, res: Response) => {
    const rentalId = req.params.id;
    const tenantId = req.user!.id;

    const rental = await rentalService.getSingleRentalRequestFromDB(
      rentalId as string,
      tenantId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request retrieved successfully",
      data: rental,
    });
  },
);

const getLandlordRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user!.id;

    const result = await rentalService.getLandlordRequestsFromDB(landlordId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully",
      data: result,
    });
  },
);

const updateRentalRequestStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user!.id;
    const rentalId = req.params.id;

    const result = await rentalService.updateRentalRequestStatusIntoDB(
      rentalId as string,
      landlordId,
      req.body.status,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request updated successfully",
      data: result,
    });
  },
);

export const rentalController = {
  createRentalRequest,
  getMyRentalRequests,
  getSingleRentalRequest,
  getLandlordRequests,
  updateRentalRequestStatus,
};
