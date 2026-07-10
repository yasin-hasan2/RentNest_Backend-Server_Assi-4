export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  profilePhoto?: string;
}

export interface IUpdateProfile {
  name?: string;
  email?: string;
  bio?: string;
  profilePhoto?: string;
}
