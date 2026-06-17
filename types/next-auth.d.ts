import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    appUserId: string;
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
  }
}