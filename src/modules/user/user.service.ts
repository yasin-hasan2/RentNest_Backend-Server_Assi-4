import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, role } = payload;

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role ?? "TENANT",
    },
  });

  // Return user without password
  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
  });
  return user;
};

const updateMyProfileInDB = async (userId: string, payload: any) => {
  const { name, email, phone } = payload;

  const updatedUser = await prisma.user.update({
    where: { id: userId },

    data: {
      name,
      email,
      phone,
    },

    omit: {
      password: true,
    },

    // include: {
    //   profile: true,
    // },
  });

  return updatedUser;
};

export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
};
