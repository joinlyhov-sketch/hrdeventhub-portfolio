// types/user-management-type/user.ts

export interface ApiUser {
  appUserId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  active: boolean;
  verified: boolean;
  telegramSubscribed: boolean;
  role?: "ADMIN" | "ORGANIZER" | "ALUMNI" | "STUDENT"; 
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  payload: ApiUser[];
}

export interface UserData {
  no: string;         
  username: string;
  email: string;
  phone: string;      
  gender: string;
  gen: number;        
  status: "Active" | "Suspended"; 
  role: "ADMIN" | "ORGANIZER" | "ALUMNI" | "STUDENT"; 
  avatar: string;
}

export const mapApiUserToUserData = (apiUser: ApiUser, index: number): UserData => ({
  no: apiUser.appUserId,
  username: apiUser.username || `${apiUser.firstName || ""} ${apiUser.lastName || ""}`.trim() || "Unknown User",
  email: apiUser.email,
  phone: apiUser.phoneNumber || "—",
  gender: apiUser.gender || "Unknown",
  gen: (index % 3) + 1, 
  status: apiUser.active ? "Active" : "Suspended",
  role: apiUser.role || "STUDENT", 
  avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(apiUser.username || 'User')}`,
});