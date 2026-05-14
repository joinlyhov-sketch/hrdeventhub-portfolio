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

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const apiBaseUrl = env?.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL is not configured.");
    }
    const loginPayload = {
      identifier: credentials.email,
      password: credentials.password,
    };
    const res = await fetch(
      `${apiBaseUrl}/auths/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      const details = errorBody ? ` - ${errorBody}` : "";
      throw new Error(`Login failed (${res.status})${details}`);
    }

    return res.json();
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL is not configured.");
    }
    const res = await fetch(
      `${apiBaseUrl}/auths/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      let errorMessage = "Registration failed";
      try {
        const errorJson = (await res.json()) as { message?: string };
        if (errorJson?.message) {
          errorMessage = errorJson.message;
        }
      } catch (error) {
        const errorBody = await res.text();
        if (errorBody) {
          errorMessage = errorBody;
        }
      }
      throw new Error(errorMessage);
    }

    return (await res.json()) as RegisterResponse;
  },

  verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL is not configured.");
    }

    const url = new URL(`${apiBaseUrl}/auths/verify-otp`);
    url.searchParams.set("email", email);
    url.searchParams.set("otp", otp);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { accept: "*/*" },
    });

    if (!res.ok) {
      let errorMessage = "OTP verification failed";
      try {
        const errorJson = (await res.json()) as { message?: string };
        if (errorJson?.message) {
          errorMessage = errorJson.message;
        }
      } catch (error) {
        const errorBody = await res.text();
        if (errorBody) {
          errorMessage = errorBody;
        }
      }
      throw new Error(errorMessage);
    }

    return (await res.json()) as VerifyOtpResponse;
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL is not configured.");
    }

    const res = await fetch(`${apiBaseUrl}/auths/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "*/*" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      let errorMessage = "Email not found.";
      try {
        const errorJson = (await res.json()) as { message?: string };
        if (errorJson?.message) {
          errorMessage = errorJson.message;
        }
      } catch (error) {
        const errorBody = await res.text();
        if (errorBody) {
          errorMessage = errorBody;
        }
      }
      throw new Error(errorMessage);
    }

    return (await res.json()) as ForgotPasswordResponse;
  },

  verifyForgotPassword: async (
    email: string,
    otp: string
  ): Promise<VerifyForgotPasswordResponse> => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL is not configured.");
    }

    const res = await fetch(`${apiBaseUrl}/auths/verify-forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "*/*" },
      body: JSON.stringify({ email, otp }),
    });

    if (!res.ok) {
      let errorMessage = "OTP verification failed";
      try {
        const errorJson = (await res.json()) as { message?: string };
        if (errorJson?.message) {
          errorMessage = errorJson.message;
        }
      } catch (error) {
        const errorBody = await res.text();
        if (errorBody) {
          errorMessage = errorBody;
        }
      }
      throw new Error(errorMessage);
    }

    return (await res.json()) as VerifyForgotPasswordResponse;
  },

  resetPassword: async (
    resetToken: string,
    newPassword: string
  ): Promise<ResetPasswordResponse> => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL is not configured.");
    }

    const res = await fetch(`${apiBaseUrl}/auths/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "*/*" },
      body: JSON.stringify({ resetToken, newPassword }),
    });

    if (!res.ok) {
      let errorMessage = "Reset password failed";
      try {
        const errorJson = (await res.json()) as { message?: string };
        if (errorJson?.message) {
          errorMessage = errorJson.message;
        }
      } catch (error) {
        const errorBody = await res.text();
        if (errorBody) {
          errorMessage = errorBody;
        }
      }
      throw new Error(errorMessage);
    }

    return (await res.json()) as ResetPasswordResponse;
  },

  resendOtp: async (email: string): Promise<ResendOtpResponse> => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL is not configured.");
    }

    const url = new URL(`${apiBaseUrl}/auths/resend`);
    url.searchParams.set("email", email);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { accept: "*/*" },
    });

    if (!res.ok) {
      let errorMessage = "Resend OTP failed";
      try {
        const errorJson = (await res.json()) as { message?: string };
        if (errorJson?.message) {
          errorMessage = errorJson.message;
        }
      } catch (error) {
        const errorBody = await res.text();
        if (errorBody) {
          errorMessage = errorBody;
        }
      }
      throw new Error(errorMessage);
    }

    return (await res.json()) as ResendOtpResponse;
  },
};