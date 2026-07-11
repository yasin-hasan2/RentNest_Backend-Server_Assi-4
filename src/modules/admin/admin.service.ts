import { Prisma, UserRole, UserStatus } from "../../../generated/prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import {
  IPropertyQuery,
  IRentalQuery,
  IUpdateUserStatus,
  IUserQuery,
} from "./admin.interface";
import httpStatus from "http-status";

const getAllUsersFromDB = async (query: IUserQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.UserWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.role) {
    andConditions.push({
      role: query.role as UserRole,
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status as UserStatus,
    });
  }

  const where: Prisma.UserWhereInput = {
    AND: andConditions,
  };

  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,

    orderBy: {
      [sortBy]: sortOrder,
    },

    omit: {
      password: true,
    },

    include: {
      profile: true,
      _count: {
        select: {
          properties: true,
          rentals: true,
          reviews: true,
        },
      },
    },
  });

  const total = await prisma.user.count({
    where,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: users,
  };
};

const updateUserStatusIntoDB = async (
  userId: string,
  payload: IUpdateUserStatus,
) => {
  const { status } = payload;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === "ADMIN") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Admin account cannot be blocked or modified",
    );
  }

  if (!["ACTIVE", "BLOCKED"].includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user status");
  }

  if (user.status === status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is already ${status.toLowerCase()}`,
    );
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      status,
    },

    omit: {
      password: true,
    },

    include: {
      profile: true,
    },
  });

  return updatedUser;
};

const getAllPropertiesForAdminFromDB = async (query: IPropertyQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.PropertyWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.location) {
    andConditions.push({
      location: query.location,
    });
  }

  if (query.propertyType) {
    andConditions.push({
      propertyType: query.propertyType,
    });
  }

  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
    });
  }

  if (query.landlordId) {
    andConditions.push({
      landlordId: query.landlordId,
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }

  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      rentPrice: {
        gte: query.minPrice ? Number(query.minPrice) : undefined,
        lte: query.maxPrice ? Number(query.maxPrice) : undefined,
      },
    });
  }

  const where: Prisma.PropertyWhereInput = {
    AND: andConditions,
  };

  const properties = await prisma.property.findMany({
    where,

    skip,
    take: limit,

    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      landlord: {
        omit: {
          password: true,
        },
      },

      category: true,

      reviews: {
        include: {
          tenant: {
            omit: {
              password: true,
            },
          },
        },
      },

      _count: {
        select: {
          rentals: true,
          reviews: true,
        },
      },
    },
  });

  const total = await prisma.property.count({
    where,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: properties,
  };
};

const getAllRentalsForAdminFromDB = async (query: IRentalQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.RentalRequestWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          tenant: {
            name: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          tenant: {
            email: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          property: {
            title: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          property: {
            location: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }

  if (query.tenantId) {
    andConditions.push({
      tenantId: query.tenantId,
    });
  }

  if (query.propertyId) {
    andConditions.push({
      propertyId: query.propertyId,
    });
  }

  if (query.landlordId) {
    andConditions.push({
      property: {
        landlordId: query.landlordId,
      },
    });
  }

  const where: Prisma.RentalRequestWhereInput = {
    AND: andConditions,
  };

  const rentals = await prisma.rentalRequest.findMany({
    where,

    skip,
    take: limit,

    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      tenant: {
        omit: {
          password: true,
        },
      },

      property: {
        include: {
          category: true,

          landlord: {
            omit: {
              password: true,
            },
          },
        },
      },

      payment: true,
    },
  });

  const total = await prisma.rentalRequest.count({
    where,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },

    data: rentals,
  };
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  getAllPropertiesForAdminFromDB,
  getAllRentalsForAdminFromDB,
};
