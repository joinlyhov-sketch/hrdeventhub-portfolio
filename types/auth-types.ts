import { DefaultSession } from "next-auth";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phoneNumber: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  status: string;
  payload: {
    token: string;
    refreshToken: string;
  };
  timestamp: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  status: string;
  payload?: {
    appUserId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    phoneNumber: string;
    active: boolean;
    verified: boolean;
    telegramSubscribed: boolean;
    createdAt: string;
    updatedAt: string;
  };
  timestamp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  status: string;
  timestamp: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  status: string;
  timestamp: string;
}

export interface VerifyForgotPasswordResponse {
  success: boolean;
  message: string;
  status: string;
  payload?: string;
  timestamp: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  status: string;
  timestamp: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  status: string;
  timestamp: string;
}

export interface AppUserPayload {
  appUserId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  active: boolean;
  verified: boolean;
  telegramSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProfileRole = "ADMIN" | "ORGANIZER" | "STUDENT" | "ALUMNI";

export interface ProfilePayload {
  profilePicture?: string;
  profileId: string;
  profileSharingMode: string;
  roles: ProfileRole;
  appUser: AppUserPayload;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  status: string;
  payload: ProfilePayload;
  timestamp: string;
}

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;    
    error?: "RefreshTokenExpired" | "RefreshTokenError";
    user: {
      id: string;
      email: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    accessToken: string;
    refreshToken: string;
    rememberMe: boolean;
    user: {
      id: string;
      email: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: number;
    rememberMe: boolean;
    id: string;
    role: string;
    error?: "RefreshTokenExpired" | "RefreshTokenError";
  }
}