"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, TransitionStartFunction } from "react";
import { resendOtpAction, verifyForgotPasswordAction } from "@/actions/auth.action";
import { useResetPasswordStore } from "@/store/useResetPasswordStore";

interface StepProps {
  startTransition: TransitionStartFunction;
  isPending: boolean;
}

function secondsFromExpiry(expiresAt: number | null): number {
  if (!expiresAt) return 300;
  return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
}

export default function VerifyStep({ startTransition, isPending }: StepProps) {
  const email = useResetPasswordStore((s) => s.email);
  const storeToken = useResetPasswordStore((s) => s.storeToken);
  const otpExpiresAt = useResetPasswordStore((s) => s.otpExpiresAt);
  const storeEmail = useResetPasswordStore((s) => s.storeEmail);
  const resetStore = useResetPasswordStore((s) => s.reset);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [autoSubmitEnabled, setAutoSubmitEnabled] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(() => secondsFromExpiry(otpExpiresAt));

  useEffect(() => {
    const timer = window.setInterval(() => {
      const remaining = secondsFromExpiry(otpExpiresAt);
      setSecondsLeft(remaining);
      if (remaining <= 0) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpExpiresAt]);

  const submitOtp = useCallback(
    (code: string) => {
      setError(null);
      setResendMessage(null);

      if (!email) {
        setError("Email context is missing.");
        return;
      }
      if (code.length !== 6) {
        setError("Please enter the 6-digit OTP.");
        return;
      }

      startTransition(async () => {
        const result = await verifyForgotPasswordAction(email, code);
        if (result?.error) {
          setError(result.error);
          setAutoSubmitEnabled(false);
          return;
        }
        if (result?.ok && result.token) {
          storeToken(result.token);
          useResetPasswordStore.setState({ step: 3 });
        }
      });
    },
    [email, startTransition, storeToken],
  );

  const handleVerify = () => submitOtp(otp.join(""));

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    
    const isFilled = next.every((digit) => digit !== "");
    if (isFilled && autoSubmitEnabled && !isPending) {
      submitOtp(next.join(""));
    }
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    if (!email) return;
    setError(null);
    setResendMessage(null);

    startTransition(async () => {
      const result = await resendOtpAction(email);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setResendMessage(result.message ?? "Verification code resent.");
      storeEmail(email);
      setOtp(["", "", "", "", "", ""]);
      setAutoSubmitEnabled(true);
      inputs.current[0]?.focus();
    });
  };

  const handleCancelAndGoBack = () => {
    setOtp(["", "", "", "", "", ""]);
    setError(null);
    setResendMessage(null);
    setAutoSubmitEnabled(true);
    
    resetStore();
    useResetPasswordStore.setState({ step: 1 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      className="flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <div className="text-center">
        <p className="text-sm text-[#6e7580]">
          We sent a secure code to your account email address.
        </p>
      </div>

      <div className="flex justify-between gap-2 my-1">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            maxLength={1}
            value={otp[i]}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            disabled={isPending}
            className="h-12 w-full rounded-xl border border-[#dce6f0] bg-white text-center text-lg font-bold text-[#24529a] outline-none transition-all focus:border-[#24529a] shadow-xs disabled:opacity-60"
          />
        ))}
      </div>

      {error && <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2 text-xs font-medium text-red-600">{error}</div>}
      {resendMessage && <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-2 text-xs font-medium text-blue-700">{resendMessage}</div>}

      <div className="text-center text-xs text-[#6e7580]">
        <button
          onClick={handleResend}
          disabled={secondsLeft > 0 || isPending}
          className="font-semibold text-[#17356f] underline underline-offset-2 disabled:text-[#b7c6dc] disabled:no-underline transition-all cursor-pointer"
        >
          Resend Code
        </button>
        <span className="ml-2 font-mono">
          ({Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, "0")})
        </span>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button
          type="button"
          disabled={isPending}
          onClick={handleCancelAndGoBack}
          className="px-5 h-[48px] border border-[#dce6f0] text-[#6e7580] text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          onClick={handleVerify}
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-2 h-[48px] rounded-xl bg-[#24529a] text-sm font-semibold text-white transition-all hover:bg-[#1f4685] disabled:opacity-70 cursor-pointer"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending ? "Verifying..." : "Submit"}
        </button>
      </div>
    </motion.div>
  );
}