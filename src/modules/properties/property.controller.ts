import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { propertyService } from "./property.service";

const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user!.id;

    const property = await propertyService.createPropertyIntoDB(
      landlordId,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property created successfully",
      data: property,
    });
  },
);

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await propertyService.getAllPropertiesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const propertyController = {
  createProperty,
  getAllProperties,
};
