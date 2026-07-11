import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { ICreateRentalRequest } from "./rental.interface";
import { RentalStatus } from "../../../generated/prisma/enums";

const createRentalRequestIntoDB = async (
  tenantId: string,
  payload: ICreateRentalRequest,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.status !== "AVAILABLE") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Property is not available for rent",
    );
  }

  if (property.landlordId === tenantId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot rent your own property",
    );
  }

  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: {
        in: ["PENDING", "APPROVED"],
      },
    },
  });

  if (existingRequest) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already requested this property",
    );
  }
  const moveInDate = new Date(payload.moveInDate);

  if (isNaN(moveInDate.getTime())) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid move-in date");
  }

  const rental = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      moveInDate,
      duration: payload.duration,
      message: payload.message,
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
        },
      },
    },
  });

  return rental;
};

const getMyRentalRequestsFromDB = async (tenantId: string) => {
  const rentals = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
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

  return rentals;
};

const getSingleRentalRequestFromDB = async (
  rentalId: string,
  tenantId: string,
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalId,
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

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rental.tenantId !== tenantId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this rental request",
    );
  }

  return rental;
};

const getLandlordRequestsFromDB = async (landlordId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },

    orderBy: {
      createdAt: "desc",
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
        },
      },

      payment: true,
    },
  });

  return requests;
};

const updateRentalRequestStatusIntoDB = async (
  rentalId: string,
  landlordId: string,
  status: RentalStatus,
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalId,
    },

    include: {
      property: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rental.property.landlordId !== landlordId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (rental.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental request has already been processed",
    );
  }

  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid rental status");
  }

  const updatedRental = await prisma.rentalRequest.update({
    where: {
      id: rentalId,
    },

    data: {
      status,
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
        },
      },

      payment: true,
    },
  });

  return updatedRental;
};

export const rentalService = {
  createRentalRequestIntoDB,
  getMyRentalRequestsFromDB,
  getSingleRentalRequestFromDB,
  getLandlordRequestsFromDB,
  updateRentalRequestStatusIntoDB,
};
