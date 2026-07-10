import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

import { ILoginUser } from "./auth.interface";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  // Validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Find user
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    throw new Error("Invalid email or password");
  }

  // Check account status
  if (existingUser.status === "BLOCKED") {
    throw new Error("Your account has been BLOCKED");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // JWT Payload
  const jwtPayload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
  };

  // Generate Access Token
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  // Generate Refresh Token
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  // Remove password
  const { password: _, ...user } = existingUser;

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  const verifiedToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  if (!verifiedToken.success) {
    throw new Error(verifiedToken.error);
  }

  const { id } = verifiedToken.data as jwt.JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  if (user.status === ("BLOCKED" as typeof user.status)) {
    throw new Error("Your account has been blocked. Please contact support.");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  return { accessToken: newAccessToken };
};

export const authService = {
  loginUser,
  refreshToken,
};
