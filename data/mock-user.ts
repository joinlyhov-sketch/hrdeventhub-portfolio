export type UserRole = "admin" | "organizer" | "student" | "alumni";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
};

export const MOCK_CURRENT_USER: CurrentUser = {
  id: "87ffa136-37e5-4e50-8c4e-2268e5b0176e",
  name: "Dita Rector",
  email: "RectorDita@gmail.com",
  role: "alumni",
  avatarInitials: "DR",
};
