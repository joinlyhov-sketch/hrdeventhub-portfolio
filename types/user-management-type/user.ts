export type RoleType = "ADMIN" | "ORGANIZER" | "ALUMNI" | "STUDENT";

export interface Generation {
  generationId: string;
  name: string;
  year: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiUser {
  appUserId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;

  profilePicture?: string;
  generation?: Generation;

  active: boolean;
  verified: boolean;
  telegramSubscribed: boolean;
  createdAt: string;
  updatedAt: string;

  role?: RoleType;
}

export interface UserData extends ApiUser {
  no: string;
  status: "Active" | "Suspended";
  gen: string;
  phone: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  status?: string;
  payload: ApiUser[];
  timestamp?: string;
}