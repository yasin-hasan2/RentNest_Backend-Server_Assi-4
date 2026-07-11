import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUsersFromDB(req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const updateUserStatus = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const payload = req.body;

  const result = await adminService.updateUserStatusIntoDB(
    userId as string,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: result,
  });
});

const getAllPropertiesForAdmin = catchAsync(async (req, res) => {
  const result = await adminService.getAllPropertiesForAdminFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAllRentalsForAdmin = catchAsync(async (req, res) => {
  const result = await adminService.getAllRentalsForAdminFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllPropertiesForAdmin,
  getAllRentalsForAdmin,
};
