import { Prisma, PropertyStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateProperty, IPropertyQuery } from "./property.interface";

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

export const propertyService = {
  createPropertyIntoDB,
  getAllPropertiesFromDB,
};
