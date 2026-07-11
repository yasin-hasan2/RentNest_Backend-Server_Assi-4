import {
  PropertyStatus,
  PropertyType,
  RentalStatus,
  UserStatus,
} from "../../../generated/prisma/client";

export interface IUserQuery {
  searchTerm?: string;
  role?: string;
  status?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IUpdateUserStatus {
  status: UserStatus;
}

export interface IPropertyQuery {
  searchTerm?: string;

  location?: string;
  propertyType?: PropertyType;
  categoryId?: string;
  landlordId?: string;
  status?: PropertyStatus;

  minPrice?: string;
  maxPrice?: string;

  page?: string;
  limit?: string;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IRentalQuery {
  searchTerm?: string;

  status?: RentalStatus;

  tenantId?: string;
  landlordId?: string;
  propertyId?: string;

  page?: string;
  limit?: string;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
