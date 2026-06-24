"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState, TransitionStartFunction } from "react";
import { z } from "zod";
import { resetPasswordAction } from "@/actions/auth.action";
import { useResetPasswordStore } from "@/store/useResetPasswordAdminStore";

interface StepProps {
  startTransition: TransitionStartFunction;
  isPending: boolean;
  handleClose: () => void;
}

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

export default function NewPasswordStep({ startTransition, isPending, handleClose }: StepProps) {
  const resetToken = useResetPasswordStore((s) => s.resetToken);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<NewPasswordErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: keyof NewPasswordErrors, value: string, setter: (v: string) => void) => {
    setter(value);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    setServerError(null);
    setSuccess(null);

    if (!resetToken) {
      setServerError("Reset verification token token is missing.");
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
        setSuccess(res.message ?? "Password securely updated.");
        setTimeout(() => handleClose(), 1500);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      className="flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <div className="space-y-3.5">
        <div className="flex flex-col gap-1">
          <div className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-all focus-within:border-[#24529a] ${errors.password ? "border-red-400" : "border-[#dce6f0]"}`}>
            <LockIcon />
            <input
              placeholder="New Password"
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={isPending}
              onChange={(e) => handleChange("password", e.target.value, setPassword)}
              className="w-full bg-transparent text-sm outline-none text-[#2d3748]"
            />
            <button type="button" onClick={() => setShowPassword((p) => !p)} className="text-xs font-semibold text-[#24529a] cursor-pointer">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 px-1">{errors.password}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <div className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-all focus-within:border-[#24529a] ${errors.confirmPassword ? "border-red-400" : "border-[#dce6f0]"}`}>
            <LockIcon />
            <input
              placeholder="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              disabled={isPending}
              onChange={(e) => handleChange("confirmPassword", e.target.value, setConfirmPassword)}
              className="w-full bg-transparent text-sm outline-none text-[#2d3748]"
            />
            <button type="button" onClick={() => setShowConfirmPassword((p) => !p)} className="text-xs font-semibold text-[#24529a] cursor-pointer">
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 px-1">{errors.confirmPassword}</p>}
        </div>
      </div>

      {serverError && <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2 text-xs font-medium text-red-600">{serverError}</div>}
      {success && <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-2 text-xs font-medium text-green-700">{success}</div>}

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="flex items-center justify-center gap-2 mt-2 h-[48px] w-full rounded-xl bg-[#24529a] text-sm font-semibold text-white transition-all hover:bg-[#1f4685] disabled:opacity-70 cursor-pointer"
      >
        {isPending && <Loader2 size={14} className="animate-spin" />}
        {isPending ? "Saving New Password..." : "Save Password"}
      </button>
    </motion.div>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0bac9" strokeWidth="2" className="shrink-0">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}