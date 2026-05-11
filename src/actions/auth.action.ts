"use client";

import { signIn } from "next-auth/react";
import { authService } from "@/service/auth.service";
import type { RegisterRequest } from "@/libs/authType/type";

export async function loginAction(formData: FormData) {
  const result = await signIn("credentials", {
    identifier: formData.get("email"),
    password: formData.get("password"),
    redirect: false,
  });

  if (result?.error) {
    return {
      error:
        result.error === "CredentialsSignin"
          ? "Invalid email or password."
          : "Something went wrong. Please try again.",
    };
  }

  return { ok: true };
}

export async function registerAction(payload: RegisterRequest) {
  console.log("Register action payload", payload);
  const {
    firstName,
    lastName,
    gender,
    email,
    password,
    dateOfBirth,
    phoneNumber,
  } = payload;

  if (
    !firstName ||
    !lastName ||
    !gender ||
    !email ||
    !password ||
    !dateOfBirth ||
    !phoneNumber
  ) {
    return { error: "All fields are required." };
  }

  try {
    const response = await authService.register(payload);
    if (!response.success) {
      return { error: response.message || "Registration failed." };
    }
    return { ok: true, payload: response.payload };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    return { error: message };
  }
}

export async function verifyOtpAction(email: string, otp: string) {
  if (!email || !otp) {
    return { error: "Email and OTP are required." };
  }

  try {
    const response = await authService.verifyOtp(email, otp);
    if (!response.success) {
      return { error: response.message || "OTP verification failed." };
    }
    return { ok: true, message: response.message };
  } catch (error) {
    const message = error instanceof Error ? error.message : "OTP verification failed.";
    return { error: message };
  }
}

export async function forgotPasswordAction(email: string) {
  if (!email) {
    return { error: "Email is required." };
  }

  try {
    const response = await authService.forgotPassword(email);
    if (!response.success) {
      return { error: response.message || "Email not found." };
    }
    return { ok: true, message: response.message };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email not found.";
    return { error: message };
  }
}

export async function verifyForgotPasswordAction(email: string, otp: string) {
  if (!email || !otp) {
    return { error: "Email and OTP are required." };
  }

  try {
    const response = await authService.verifyForgotPassword(email, otp);
    if (!response.success) {
      return { error: response.message || "OTP verification failed." };
    }
    return { ok: true, token: response.payload, message: response.message };
  } catch (error) {
    const message = error instanceof Error ? error.message : "OTP verification failed.";
    return { error: message };
  }
}

export async function resetPasswordAction(resetToken: string, newPassword: string) {
  if (!resetToken || !newPassword) {
    return { error: "Reset token and new password are required." };
  }

  try {
    const response = await authService.resetPassword(resetToken, newPassword);
    if (!response.success) {
      return { error: response.message || "Reset password failed." };
    }
    return { ok: true, message: response.message };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reset password failed.";
    return { error: message };
  }
}

export async function resendOtpAction(email: string) {
  if (!email) {
    return { error: "Email is required." };
  }

  try {
    const response = await authService.resendOtp(email);
    if (!response.success) {
      return { error: response.message || "Resend OTP failed." };
    }
    return { ok: true, message: response.message };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resend OTP failed.";
    return { error: message };
  }
}