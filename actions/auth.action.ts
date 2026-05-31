"use client"

import { signIn } from "next-auth/react";
import { authService } from "../service/auth.service";
import type { RegisterRequest } from "../types/auth-types";
export async function logoutAction(refreshToken: string) {
  try {
    await authService.logout(refreshToken);
  } catch(error) {
    console.error("Backend logout failed:", error);
  }
}

export async function loginAction(formData: FormData) {
  const result = await signIn("credentials", {
    identifier: formData.get("identifier"),
    password:   formData.get("password"),
    rememberMe: formData.get("rememberMe"), 
    redirect:   false,
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
  const { firstName, lastName, gender, email, password, dateOfBirth, phoneNumber } = payload;

  if (!firstName || !lastName || !gender || !email || !password || !dateOfBirth || !phoneNumber) {
    return { error: "All fields are required." };
  }

  const rawPhone    = phoneNumber.trim();
  const digitsOnly  = rawPhone.replace(/\D/g, "");
  const normalized  = digitsOnly.startsWith("0") ? digitsOnly.slice(1) : digitsOnly;
  const formattedPhone = `+855${normalized}`;

  const normalizedPayload: RegisterRequest = { ...payload, phoneNumber: formattedPhone };

  try {
    const response = await authService.register(normalizedPayload);
    if (!response.success) {
      return { error: response.message || "Registration failed." };
    }
    return { ok: true, payload: response.payload };
  } catch (error) {
    const message =
      error instanceof Error && /409|conflict|already/i.test(error.message)
        ? "This email is already taken. Please use a different one."
        : error instanceof Error
          ? error.message
          : "Registration failed.";
    return { error: message };
  }
}

export async function verifyOtpAction(email: string, otp: string) {
  if (!email || !otp) return { error: "Email and OTP are required." };
  try {
    const response = await authService.verifyOtp(email, otp);
    if (!response.success) return { error: response.message || "OTP verification failed." };
    return { ok: true, message: response.message };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "OTP verification failed." };
  }
}

export async function forgotPasswordAction(email: string) {
  if (!email) return { error: "Email is required." };
  try {
    const response = await authService.forgotPassword(email);
    if (!response.success) return { error: response.message || "Email not found." };
    return { ok: true, message: response.message };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Email not found." };
  }
}

export async function verifyForgotPasswordAction(email: string, otp: string) {
  if (!email || !otp) return { error: "Email and OTP are required." };
  try {
    const response = await authService.verifyForgotPassword(email, otp);
    if (!response.success) return { error: response.message || "OTP verification failed." };
    return { ok: true, token: response.payload, message: response.message };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "OTP verification failed." };
  }
}

export async function resetPasswordAction(resetToken: string, newPassword: string) {
  if (!resetToken || !newPassword) return { error: "Reset token and new password are required." };
  try {
    const response = await authService.resetPassword(resetToken, newPassword);
    if (!response.success) return { error: response.message || "Reset password failed." };
    return { ok: true, message: response.message };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Reset password failed." };
  }
}

export async function resendOtpAction(email: string) {
  if (!email) return { error: "Email is required." };
  try {
    const response = await authService.resendOtp(email);
    if (!response.success) return { error: response.message || "Resend OTP failed." };
    return { ok: true, message: response.message };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Resend OTP failed." };
  }
}