"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { z } from "zod";
import { registerAction } from "../../../actions/auth.action";
import type { RegisterRequest } from "../../../types/auth-types";
import { useRegisterStore } from "../../../store/useRegisterStore";
import { Mail, Lock, AlertCircle } from "lucide-react";

const step2Schema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .pipe(z.email({ message: "Email is invalid" })),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least 1 capital letter")
      .regex(/[0-9]/, "Password must contain at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 symbol"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AccountValidate = Partial<
  Record<"email" | "password" | "confirmPassword", string>
>;

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least 1 capital letter")
  .regex(/[0-9]/, "Password must contain at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 symbol");

export default function Step2Account() {
  const form = useRegisterStore((s) => s.form);
  const updateField = useRegisterStore((s) => s.updateField);
  const setStep = useRegisterStore((s) => s.setStep);
  const goToOTP = useRegisterStore((s) => s.goToOTP);
  const setFieldError = useRegisterStore((s) => s.setFieldError);

  const [errors, setErrors] = useState<AccountValidate>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: keyof AccountValidate, value: string) => {
    updateField(field, value);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if (serverError) {
      setServerError(null);
    }
  };

  const handlePasswordBlur = () => {
    const result = passwordSchema.safeParse(form.password);

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        password: result.error.issues[0].message,
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const handleConfirmPasswordBlur = () => {
    if (!form.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Please confirm your password",
      }));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  };

  const handleRegister = () => {
    if (isPending) return;

    setServerError(null);

    const result = step2Schema.safeParse({
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: AccountValidate = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AccountValidate;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const payload: RegisterRequest = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender ? form.gender[0].toUpperCase() : "",
      email: form.email.trim(),
      password: form.password,
      dateOfBirth: form.dateOfBirth,
      phoneNumber: form.phoneNumber.trim(),
    };

    startTransition(async () => {
      const res = await registerAction(payload);

      if (res?.error) {
        const msg = res.error;
        const lower = msg.toLowerCase();

        if (lower.includes("duplicate entry detected")) {
          setFieldError(
            "phoneNumber",
            "This phone number is already used. Please use another phone number.",
          );
          setStep(1);
          return;
        }

        if (
          lower.includes("phone") ||
          lower.includes("phone number") ||
          lower.includes("phonenumber") ||
          lower.includes("mobile") ||
          lower.includes("tel")
        ) {
          setFieldError(
            "phoneNumber",
            "This phone number is already used. Please use another phone number.",
          );
          setStep(1);
          return;
        }

        if (
          lower.includes("password") ||
          lower.includes("stronger") ||
          lower.includes("weak")
        ) {
          setErrors({ password: msg });
          return;
        }

        if (
          lower.includes("email") ||
          lower.includes("already taken") ||
          lower.includes("already used") ||
          lower.includes("conflict")
        ) {
          setErrors({ email: msg });
          return;
        }

        setServerError(msg);
        return;
      }

      if (res?.ok) {
        goToOTP(form.email.trim());
      }
    });
  };

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:gap-5 w-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ width: "100%" }}
    >
      <div className="mb-3 sm:mb-5 text-center">
        <h2 className="text-[22px] sm:text-[28px] font-extrabold tracking-[-1px] sm:tracking-[-2px] text-[#17356f]">
          Account Info
        </h2>
        <p className="mt-1 sm:mt-2 text-sm text-[#6e7580]">
          Join HRD EventHub &amp; Get started
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 w-full">
        <div className="flex flex-col gap-1 w-full">
          <div
            className={`flex items-center gap-3 rounded-xl sm:rounded-2xl border bg-white px-3 sm:px-4 py-3 sm:py-3.5 w-full transition-all focus-within:border-[#24529a] ${
              errors.email ? "border-red-400" : "border-[#dce6f0]"
            }`}
          >
            <Mail
              size={16}
              color="#b0bac9"
              strokeWidth={2}
              className="shrink-0"
            />

            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                handleChange("email", e.target.value.toLowerCase())
              }
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
            />
          </div>

          {errors.email && <FieldError message={errors.email} />}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div
            className={`flex items-center gap-3 rounded-xl sm:rounded-2xl border bg-white px-3 sm:px-4 py-3 sm:py-3.5 w-full transition-all focus-within:border-[#24529a] ${
              errors.password ? "border-red-400" : "border-[#dce6f0]"
            }`}
          >
            <Lock
              size={16}
              color="#b0bac9"
              strokeWidth={2}
              className="shrink-0"
            />

            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={handlePasswordBlur}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="text-xs font-semibold text-[#24529a] shrink-0 px-1 sm:px-2"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.password && <FieldError message={errors.password} />}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div
            className={`flex items-center gap-3 rounded-xl sm:rounded-2xl border bg-white px-3 sm:px-4 py-3 sm:py-3.5 w-full transition-all focus-within:border-[#24529a] ${
              errors.confirmPassword ? "border-red-400" : "border-[#dce6f0]"
            }`}
          >
            <Lock
              size={16}
              color="#b0bac9"
              strokeWidth={2}
              className="shrink-0"
            />

            <input
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) =>
                handleChange("confirmPassword", e.target.value)
              }
              onBlur={handleConfirmPasswordBlur}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="text-xs font-semibold text-[#24529a] shrink-0 px-1 sm:px-2"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.confirmPassword && (
            <FieldError message={errors.confirmPassword} />
          )}
        </div>
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-3 sm:gap-4 w-full">
        <button
          type="button"
          onClick={() => setStep(1)}
          disabled={isPending}
          className="h-11 sm:h-14.5 rounded-xl sm:rounded-2xl border border-[#c8d6ee] bg-white text-base sm:text-lg font-semibold text-[#17356f] transition-all hover:bg-[#f0f5ff] disabled:opacity-70"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleRegister}
          disabled={isPending}
          className="h-11 sm:h-14.5 rounded-xl sm:rounded-2xl bg-[#24529a] text-base sm:text-lg font-semibold text-white transition-all hover:bg-[#1f4685] disabled:opacity-70"
        >
          {isPending ? "Registering..." : "Register"}
        </button>
      </div>
    </motion.div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 px-1">
      <AlertCircle size={13} className="shrink-0" />
      {message}
    </p>
  );
}