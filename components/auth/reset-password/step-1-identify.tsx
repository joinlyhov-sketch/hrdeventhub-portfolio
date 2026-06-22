"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { z } from "zod";
import { forgotPasswordAction } from "../../../actions/auth.action";
import { useResetPasswordStore } from "../../../store/useResetPasswordStore";
import { Mail, AlertCircle } from "lucide-react";

const emailSchema = z.string().min(1, "Email is required").email("Email is invalid");

export default function IdentifyStep() {
  const storeEmail = useResetPasswordStore((s) => s.storeEmail);

  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError(null);

    const result = emailSchema.safeParse(value.trim());
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    startTransition(async () => {
      const result = await forgotPasswordAction(value.trim());
      if (result?.error) {
        setError(result.error);
        return;
      }
      storeEmail(value.trim());
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col gap-4 w-full items-stretch sm:px-8"
    >
      <div className="mb-2 text-center">
        <h2 className="text-[22px] sm:text-[28px] font-bold text-[#17356f]">
          Reset Password
        </h2>
        <p className="mt-2 text-[#6e7580] text-sm sm:text-base">
          We&apos;ll help you get back in. Enter your email to receive a reset link.
        </p>
      </div>

      {/* Email field with inline validation */}
      <div className="flex flex-col gap-1.5">
        <div
          className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-all focus-within:border-[#24529a] ${
            error ? "border-red-400" : "border-[#dce6f0]"
          }`}
        >
          <Mail size={18} color="#b0bac9" strokeWidth={2} className="shrink-0" />
          <input
            placeholder="Email"
            type="email"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
          />
        </div>
        {error && <FieldError message={error} />}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="h-12 sm:h-14.5 w-full rounded-2xl bg-[#24529a] text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:bg-[#1f4685] disabled:opacity-70 cursor-pointer"
      >
        {isPending ? "Sending..." : "Send Reset Link"}
      </button>
    </motion.div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 px-1">
      <AlertCircle size={14} className="shrink-0" />
      {message}
    </p>
  );
}
