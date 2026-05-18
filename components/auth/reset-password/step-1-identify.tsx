"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { forgotPasswordAction } from "../../../actions/auth.action";
import { useResetPasswordStore } from "../../../store/useResetPasswordStore";
import { Mail } from "lucide-react";

export default function IdentifyStep() {
  const storeEmail = useResetPasswordStore((s) => s.storeEmail);

  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError(null);
    if (!value.trim()) {
      setError("Email is required.");
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
      className="flex flex-col gap-5 w-full items-stretch px-15"
    >
      <div className="mb-5 text-center">
        <h2 className="text-[28px] font-bold text-[#17356f]">
          Reset Password
        </h2>
        <p className="mt-2 text-[#6e7580] text-[16px]">
          We&apos;ll help you get back in. Enter your email to receive a <br></br>reset
          link.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[#dce6f0] bg-white px-4 py-3.5 focus-within:border-[#24529a] transition-all">
        <Mail size={18} color="#b0bac9" strokeWidth={2} className="shrink-0" />
        <input
          placeholder="Email"
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-3 h-[48px] w-full rounded-2xl bg-[#24529a] text-lg text-white transition-all duration-300 hover:bg-[#1f4685] disabled:opacity-70 cursor-pointer"
      >
        {isPending ? "Sending..." : "Send Reset Link"}
      </button>
    </motion.div>
  );
}