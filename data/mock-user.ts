export type UserRole = "admin" | "organizer" | "student" | "alumni";

export type CurrentUser = {
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
};

export const MOCK_USER_ROLE: UserRole = "admin";

export const MOCK_CURRENT_USER: CurrentUser = {
  name: "Dita Rector",
  email: "RectorDita@gmail.com",
  role: "admin",
  avatarInitials: "DR",
};
