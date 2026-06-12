"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState, TransitionStartFunction } from "react";
import { forgotPasswordAction } from "@/actions/auth.action";
import { useResetPasswordStore } from "@/store/useResetPasswordAdminStore";

interface StepProps {
  startTransition: TransitionStartFunction;
  isPending: boolean;
}

export default function ConfirmStep({ startTransition, isPending }: StepProps) {
  const email = useResetPasswordStore((s) => s.email);
  const advanceToVerify = useResetPasswordStore((s) => s.advanceToVerify);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = () => {
    setError(null);

    if (!email) {
      setError("Account email context missing. Please reload page and try again.");
      return;
    }

    startTransition(async () => {
      const result = await forgotPasswordAction(email);
      if (result?.error) {
        setError(result.error);
        return;
      }
      advanceToVerify(email);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      className="flex flex-col gap-5 w-full text-center max-w-md mx-auto"
    >
      <div>
        <h3 className="text-xl font-bold text-[#17356f]">Are you sure?</h3>
        <p className="mt-2 text-sm text-[#6e7580] leading-relaxed">
          You are initiating a password reset request for{" "}
          <span className="font-semibold text-[#24529a]">
            {email || "your account"}
          </span>
          . We will send a secure 6-digit OTP code to verify your identity.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 text-left">
          {error}
        </div>
      )}

      <button
        onClick={handleSendOtp}
        disabled={isPending}
        className="mt-2 flex items-center justify-center gap-2 h-[50px] w-full rounded-xl bg-[#24529a] text-base font-semibold text-white transition-all hover:bg-[#1f4685] disabled:opacity-70 cursor-pointer shadow-sm"
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        {isPending ? "Sending OTP Code..." : "Yes, Send Code"}
      </button>
    </motion.div>
  );
}