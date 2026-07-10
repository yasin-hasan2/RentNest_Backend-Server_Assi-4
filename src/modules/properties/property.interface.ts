export interface ICreateProperty {
  title: string;
  description: string;
  location: string;
  address?: string;
  rentPrice: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType:
    | "APARTMENT"
    | "HOUSE"
    | "STUDIO"
    | "DUPLEX"
    | "VILLA"
    | "OFFICE";
  amenities: string[];
  images: string[];
  categoryId: string;
}
