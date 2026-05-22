export type UserRole = "admin" | "organizer" | "student" | "alumni";

export type CurrentUser = {
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
};

export const MOCK_USER_ROLE: UserRole = "student";

export const MOCK_CURRENT_USER: CurrentUser = {
  name: "Mork Sathim",
  email: "sathim35@gmail.com",
  role: "student",
  avatarInitials: "MS",
};
