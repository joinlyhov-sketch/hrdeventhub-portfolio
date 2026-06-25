import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string;
    };
    accessToken: string;
    refreshToken: string;
    appUserId: string;
    accessTokenExpiry: number;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    appUserId: string;
    accessToken: string;
    refreshToken: string;
    role: string;
    error?: string;
    accessTokenExpiry?: number;
    rememberMe?: boolean;
  }
}