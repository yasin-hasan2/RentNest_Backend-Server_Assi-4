import { prisma } from "../../lib/prisma";
import { ICreateProperty } from "./property.interface";

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

export const propertyService = {
  createPropertyIntoDB,
};
