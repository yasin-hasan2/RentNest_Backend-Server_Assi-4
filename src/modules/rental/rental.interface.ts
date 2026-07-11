export interface ICreateRentalRequest {
  propertyId: string;
  moveInDate: string;
  duration: number;
  message?: string;
}
