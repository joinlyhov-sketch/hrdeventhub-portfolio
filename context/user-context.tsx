"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { authService } from "../service/auth.service";
import type { ProfileRole } from "../types/auth-types";

export type UserRole = "admin" | "organizer" | "student" | "alumni";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  profilePicture?: string; 
};

const mapProfileRole = (role?: ProfileRole): UserRole => {
  switch (role) {
    case "ADMIN":     return "admin";
    case "ORGANIZER": return "organizer";
    case "ALUMNI":    return "alumni";
    case "STUDENT":
    default:          return "student";
  }
};

type UserContextValue = {
  currentUser: CurrentUser | null;
  isLoading: boolean;
};

const UserContext = createContext<UserContextValue>({
  currentUser: null,
  isLoading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = session?.accessToken;

    const fetchUser = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const profileResponse = await authService.getProfileMe(accessToken);
        const profile = profileResponse.payload;
        const appUser = profile.appUser;

        const displayName = `${appUser.firstName} ${appUser.lastName}`.trim();
        const initials = `${appUser.firstName?.[0] ?? ""}${appUser.lastName?.[0] ?? ""}`.toUpperCase();

        setCurrentUser({
          id: appUser.appUserId,
          name: displayName || appUser.username,
          email: appUser.email,
          role: mapProfileRole(profile.roles),
          avatarInitials: initials || "?",
          profilePicture: profile.profilePicture || undefined, 
        });
      } catch {
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [session?.accessToken]);

  return (
    <UserContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useCurrentUser = () => useContext(UserContext);