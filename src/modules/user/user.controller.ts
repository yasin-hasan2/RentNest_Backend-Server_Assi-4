import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userService.registerUserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: user,
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const { accessToken } = req.cookies;
    // console.log("Access Token:", accessToken);

    // const verifiedToken = jwtUtils.verifyToken(
    //   accessToken,
    //   config.jwt_access_secret,
    // ) as jwt.JwtPayload;
    // console.log("Verified Token:", verifiedToken);
    // console.log("verifiedToken.id =", (verifiedToken as any).id);
    // console.log("verifiedToken.data =", (verifiedToken as any).data);
    // console.log("verifiedToken.data.id =", (verifiedToken as any).data?.id);

    // if (typeof verifiedToken === "string") {
    //   throw new Error(verifiedToken);
    // }

    // const user = await userService.getMyProfileFromDB(
    //   (verifiedToken as any).data.id,
    // );

    const user = await userService.getMyProfileFromDB(req.user?.id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile retrieved successfully",
      data: { user },
      // data: { user },
    });
  },
);

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const payload = req.body;

    const updatedProfile = await userService.updateMyProfileInDB(
      userId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile updated successfully",
      data: { updatedProfile },
    });
  },
);

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};
