import {
  AuthResponse,
  ForgotPasswordResponse,
  LoginRequest,
  ProfileResponse,
  RegisterRequest,
  RegisterResponse,
  ResendOtpResponse,
  ResetPasswordResponse,
  VerifyForgotPasswordResponse,
  VerifyOtpResponse,
} from "../types/auth-types";
import { apiGet, apiPost } from "../libs/api";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiPost<AuthResponse, { identifier: string; password: string }>(
      "/auths/login",
      { identifier: credentials.email, password: credentials.password },
    );
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiPost<RegisterResponse, RegisterRequest>("/auths/register", data);
  },

  verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const params = new URLSearchParams({ email, otp });
    return apiPost<VerifyOtpResponse>(`/auths/verify-otp?${params.toString()}`);
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    return apiPost<ForgotPasswordResponse, { email: string }>(
      "/auths/forgot-password",
      { email },
    );
  },

  verifyForgotPassword: async (
    email: string,
    otp: string,
  ): Promise<VerifyForgotPasswordResponse> => {
    return apiPost<VerifyForgotPasswordResponse, { email: string; otp: string }>(
      "/auths/verify-forgot-password",
      { email, otp },
    );
  },

  resetPassword: async (
    resetToken: string,
    newPassword: string,
  ): Promise<ResetPasswordResponse> => {
    return apiPost<ResetPasswordResponse, { resetToken: string; newPassword: string }>(
      "/auths/reset-password",
      { resetToken, newPassword },
    );
  },

  resendOtp: async (email: string): Promise<ResendOtpResponse> => {
    const params = new URLSearchParams({ email });
    return apiPost<ResendOtpResponse>(`/auths/resend?${params.toString()}`);
  },

  getProfileMe: async (authToken: string): Promise<ProfileResponse> =>
    apiGet<ProfileResponse>("/profile/me", { authToken, accept: "*/*" }),
};