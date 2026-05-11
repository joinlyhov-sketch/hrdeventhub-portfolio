"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/actions/auth.action";
import { useResetPasswordStore } from "@/store/useResetPasswordStore";

export default function NewPasswordStep() {
  const resetToken = useResetPasswordStore((s) => s.resetToken);
  const reset = useResetPasswordStore((s) => s.reset);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isPasswordValid = (value: string) => {
    const hasMinLength = value.length >= 8;
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);
    return hasMinLength && hasNumber && hasSpecial;
  };

  const handleSubmit = () => {
    setError(null);
    setSuccess(null);

    if (!resetToken) {
      setError("Reset token is missing. Please verify OTP again.");
      return;
    }
    if (!isPasswordValid(password)) {
      setError(
        "Password must be at least 8 characters and include a number and symbol.",
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordAction(resetToken, password);
      if (result?.error) {
        setError(result.error);
        return;
      }
      if (result?.ok) {
        setSuccess(result.message ?? "Password reset successfully.");
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

      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[#dce6f0] bg-white px-4 py-3.5 focus-within:border-[#24529a] transition-all">
          <LockIcon />
          <input
            placeholder="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <div className="flex items-center gap-3 rounded-2xl border border-[#dce6f0] bg-white px-4 py-3.5 focus-within:border-[#24529a] transition-all">
          <LockIcon />
          <input
            placeholder="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
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

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#b0bac9"
      strokeWidth="2"
      className="shrink-0"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
