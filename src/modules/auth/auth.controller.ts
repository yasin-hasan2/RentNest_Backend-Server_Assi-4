import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { authService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    console.log(req.body);
    const { user, accessToken, refreshToken } =
      await authService.loginUser(payload);

    // Access Token Cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax", // none in production with secure:true
      maxAge: 1000 * 60 * 60 * 24,
    });

    // Refresh Token Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged in successfully",
      data: {
        user,
        accessToken,
      },
    });
  },
);

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;
    // console.log("Refresh Token from cookies:", refreshToken);
    // ? req.cookies
    // : req.headers.authorization?.startsWith("Bearer ")
    //   ? { refreshToken: req.headers.authorization?.split(" ")[1] }
    //   : req.headers;

    if (!refreshToken) {
      throw new Error("Refresh token not found. Please log in again.");
    }

    const { accessToken } = await authService.refreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Refresh token generated successfully",
      data: { accessToken },
    });
  },
);

export const authController = {
  loginUser,
  refreshToken,
};
