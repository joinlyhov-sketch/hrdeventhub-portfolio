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
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
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

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    accessToken: string;
    refreshToken?: string;
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
    refreshToken?: string;
    id: string;
    role: string;
  }
}