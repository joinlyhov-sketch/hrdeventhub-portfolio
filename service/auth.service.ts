import {
  AuthResponse,
  ForgotPasswordResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  ResendOtpResponse,
  ResetPasswordResponse,
  VerifyForgotPasswordResponse,
  VerifyOtpResponse,
} from "../types/auth-types";
import { env } from "../libs/env";

const apiBaseUrl = env?.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("API base URL is not configured.");
}

const handleResponseError = async (res: Response, defaultMessage: string): Promise<never> => {
  let errorMessage = defaultMessage;
  try {
    const errorJson = (await res.json()) as { message?: string };
    if (errorJson?.message) {
      errorMessage = errorJson.message;
    }
  } catch {
    const errorBody = await res.text();
    if (errorBody) {
      errorMessage = errorBody;
    }
  }
  throw new Error(errorMessage);
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const loginPayload = {
      identifier: credentials.email,
      password: credentials.password,
    };
    const res = await fetch(`${apiBaseUrl}/auths/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginPayload),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      const details = errorBody ? ` - ${errorBody}` : "";
      throw new Error(`Login failed (${res.status})${details}`);
    }

    return res.json();
  },

register: async (data: RegisterRequest): Promise<RegisterResponse> => {
  const res = await fetch(`${apiBaseUrl}/auths/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.status === 409) {
    throw new Error("This email is already taken. Please use a different one.");
  }

  if (!res.ok) await handleResponseError(res, "Registration failed");
  return res.json();
},
  verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const url = new URL(`${apiBaseUrl}/auths/verify-otp`);
    url.searchParams.set("email", email);
    url.searchParams.set("otp", otp);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { accept: "*/*" },
    });

    if (!res.ok) await handleResponseError(res, "OTP verification failed");
    return res.json();
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const res = await fetch(`${apiBaseUrl}/auths/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "*/*" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) await handleResponseError(res, "Email not found.");
    return res.json();
  },

  verifyForgotPassword: async (
    email: string,
    otp: string
  ): Promise<VerifyForgotPasswordResponse> => {
    const res = await fetch(`${apiBaseUrl}/auths/verify-forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "*/*" },
      body: JSON.stringify({ email, otp }),
    });

    if (!res.ok) await handleResponseError(res, "OTP verification failed");
    return res.json();
  },

  resetPassword: async (
    resetToken: string,
    newPassword: string
  ): Promise<ResetPasswordResponse> => {
    const res = await fetch(`${apiBaseUrl}/auths/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "*/*" },
      body: JSON.stringify({ resetToken, newPassword }),
    });

    if (!res.ok) await handleResponseError(res, "Reset password failed");
    return res.json();
  },

  resendOtp: async (email: string): Promise<ResendOtpResponse> => {
    const url = new URL(`${apiBaseUrl}/auths/resend`);
    url.searchParams.set("email", email);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { accept: "*/*" },
    });

    if (!res.ok) await handleResponseError(res, "Resend OTP failed");
    return res.json();
  },
};