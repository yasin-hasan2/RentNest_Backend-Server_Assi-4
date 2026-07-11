import httpStatus from "http-status";
import { Prisma, PropertyStatus } from "../../../generated/prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import {
  ICreateProperty,
  IPropertyQuery,
  IUpdateProperty,
} from "./property.interface";

const createPropertyIntoDB = async (
  landlordId: string,
  payload: ICreateProperty,
) => {
  const {
    title,
    description,
    location,
    address,
    rentPrice,
    bedrooms,
    bathrooms,
    area,
    propertyType,
    amenities,
    images,
    categoryId,
  } = payload;

  // Check category exists
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const property = await prisma.property.create({
    data: {
      title,
      description,
      location,
      address,
      rentPrice,
      bedrooms,
      bathrooms,
      area,
      propertyType,
      amenities,
      images,

      landlord: {
        connect: {
          id: landlordId,
        },
      },

      category: {
        connect: {
          id: categoryId,
        },
      },
    },

    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },

      category: true,
    },
  });

  return property;
};

const getAllPropertiesFromDB = async (query: IPropertyQuery) => {
  // Pagination
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  // Sorting
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  // Dynamic conditions
  const andConditions: Prisma.PropertyWhereInput[] = [];

  // Search
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
      ],
    });
  }

  // Location filter
  if (query.location) {
    andConditions.push({
      location: {
        contains: query.location,
        mode: "insensitive",
      },
    });
  }

  // Category filter
  if (query.category) {
    andConditions.push({
      category: {
        name: {
          equals: query.category,
          mode: "insensitive",
        },
      },
    });
  }

  // Status filter
  if (query.status) {
    andConditions.push({
      status: query.status as PropertyStatus,
    });
  }

  // Minimum Price
  if (query.minPrice) {
    andConditions.push({
      rentPrice: {
        gte: Number(query.minPrice),
      },
    });
  }

  // Maximum Price
  if (query.maxPrice) {
    andConditions.push({
      rentPrice: {
        lte: Number(query.maxPrice),
      },
    });
  }

  // Fetch properties
  const properties = await prisma.property.findMany({
    where: {
      AND: andConditions,
    },

    take: limit,
    skip,

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

      _count: {
        select: {
          rentals: true,
          reviews: true,
        },
      },
    },
  });

  // Count
  const totalPropertyCount = await prisma.property.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: properties,
    meta: {
      page,
      limit,
      total: totalPropertyCount,
      totalPages: Math.ceil(totalPropertyCount / limit),
    },
  };
};

const getSinglePropertyFromDB = async (propertyId: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId,
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
        orderBy: {
          createdAt: "desc",
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

  return property;
};

const updatePropertyIntoDB = async (
  propertyId: string,
  landlordId: string,
  payload: IUpdateProperty,
) => {
  const existingProperty = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!existingProperty) {
    throw new Error("Property not found");
  }

  // Check ownership
  if (existingProperty.landlordId !== landlordId) {
    throw new Error("You are not authorized to update this property");
  }

  const updatedProperty = await prisma.property.update({
    where: {
      id: propertyId,
    },

    data: {
      title: payload.title,
      description: payload.description,
      location: payload.location,
      address: payload.address,
      rentPrice: payload.rentPrice,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      area: payload.area,
      amenities: payload.amenities,
      status: payload.status,

      ...(payload.categoryId && {
        category: {
          connect: {
            id: payload.categoryId,
          },
        },
      }),
    },

    include: {
      landlord: {
        omit: {
          password: true,
        },
      },

      category: true,
    },
  });

  return updatedProperty;
};

const deletePropertyFromDB = async (propertyId: string, landlordId: string) => {
  const existingProperty = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!existingProperty) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (existingProperty.landlordId !== landlordId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this property",
    );
  }

  const deletedProperty = await prisma.property.delete({
    where: {
      id: propertyId,
    },
  });

  return deletedProperty;
};

export const propertyService = {
  createPropertyIntoDB,
  getAllPropertiesFromDB,
  getSinglePropertyFromDB,
  updatePropertyIntoDB,
  deletePropertyFromDB,
};
