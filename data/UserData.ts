export interface UserData {
  no: number;
  avatar: string;
  username: string;
  email: string;
  phone: string;
  gender: "Male" | "Female";
  gen: number;
  status: "Active" | "Suspended";
}