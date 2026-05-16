"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "../../../actions/auth.action";
import { useResetPasswordStore } from "../../../store/useResetPasswordStore";

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least 1 capital letter")
  .regex(/[0-9]/, "Password must contain at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 symbol");

const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type NewPasswordErrors = Partial<Record<"password" | "confirmPassword", string>>;

export default function NewPasswordStep() {
  const resetToken = useResetPasswordStore((s) => s.resetToken);
  const reset = useResetPasswordStore((s) => s.reset);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<NewPasswordErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (
    field: keyof NewPasswordErrors,
    value: string,
    setter: (v: string) => void
  ) => {
    setter(value);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handlePasswordBlur = () => {
    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        password: result.error.issues[0].message,
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Please confirm your password",
      }));
      return;
    }
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleSubmit = () => {
    setServerError(null);
    setSuccess(null);

    if (!resetToken) {
      setServerError("Reset token is missing. Please verify OTP again.");
      return;
    }

    const result = newPasswordSchema.safeParse({ password, confirmPassword });

    if (!result.success) {
      const fieldErrors: NewPasswordErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof NewPasswordErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    startTransition(async () => {
      const res = await resetPasswordAction(resetToken, password);
      if (res?.error) {
        setServerError(res.error);
        return;
      }
      if (res?.ok) {
        setSuccess(res.message ?? "Password reset successfully.");
        reset();
        setTimeout(() => router.push("/login"), 1200);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-5"
    >
      <div className="mb-5 text-center">
        <h2 className="text-[48px] font-extrabold tracking-[-2px] text-[#17356f]">
          New Password
        </h2>
        <p className="mt-2 text-[#6e7580]">
          You can enter your new password. You can change it successfully.
        </p>
      </div>

      <div className="space-y-1">
        <div className="flex flex-col gap-1">
          <div
            className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-all focus-within:border-[#24529a] ${
              errors.password ? "border-red-400" : "border-[#dce6f0]"
            }`}
          >
            <LockIcon />
            <input
              placeholder="New Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => handleChange("password", e.target.value, setPassword)}
              onBlur={handlePasswordBlur}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-xs font-semibold text-[#24529a] shrink-0"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <FieldError message={errors.password} />}
        </div>

        <div className="flex flex-col gap-1 pt-4">
          <div
            className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-all focus-within:border-[#24529a] ${
              errors.confirmPassword ? "border-red-400" : "border-[#dce6f0]"
            }`}
          >
            <LockIcon />
            <input
              placeholder="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) =>
                handleChange("confirmPassword", e.target.value, setConfirmPassword)
              }
              onBlur={handleConfirmPasswordBlur}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="text-xs font-semibold text-[#24529a] shrink-0"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && <FieldError message={errors.confirmPassword} />}
        </div>
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {serverError}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          {success}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-3 h-[58px] w-full rounded-2xl bg-[#24529a] text-lg font-semibold text-white transition-all duration-300 hover:bg-[#1f4685] disabled:opacity-70 cursor-pointer"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </motion.div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-sm text-red-500 px-1">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      {message}
    </p>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b0bac9" strokeWidth="2" className="shrink-0">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}