export type UserRole = "admin" | "organizer" | "student" | "alumni";
export interface UserData {
  no: number;
  avatar: string;
  username: string;
  role: UserRole;
  email: string;
  phone: string;
  gender: "Male" | "Female";
  gen: number;
  status: "Active" | "Suspended";
}
