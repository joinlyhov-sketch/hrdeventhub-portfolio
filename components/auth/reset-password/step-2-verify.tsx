"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  resendOtpAction,
  verifyForgotPasswordAction,
} from "../../../actions/auth.action";
import { useResetPasswordStore } from "../../../store/useResetPasswordStore";

function secondsFromExpiry(expiresAt: number | null): number {
  if (!expiresAt) return 300;
  return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
}

export default function VerifyStep() {
  const email = useResetPasswordStore((s) => s.email);
  const storeToken = useResetPasswordStore((s) => s.storeToken);
  const otpExpiresAt = useResetPasswordStore((s) => s.otpExpiresAt);
  const storeEmail = useResetPasswordStore((s) => s.storeEmail);
  const reset = useResetPasswordStore((s) => s.reset);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [autoSubmitEnabled, setAutoSubmitEnabled] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    secondsFromExpiry(otpExpiresAt),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      const remaining = secondsFromExpiry(otpExpiresAt);
      setSecondsLeft(remaining);
      if (remaining <= 0) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpExpiresAt]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const submitOtp = useCallback(
    (code: string) => {
      setError(null);
      setSuccess(null);
      setResendMessage(null);

      if (!email) {
        setError("Email is missing. Please go back.");
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
          reset();
          storeToken(result.token);
        }
      });
    },
    [email, reset, startTransition, storeToken],
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
    if (!email) {
      setError("Email is missing. Please go back.");
      return;
    }
    setError(null);
    setResendMessage(null);

    startTransition(async () => {
      const result = await resendOtpAction(email);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setResendMessage(result.message ?? "Verification OTP successfully resent.");
      storeEmail(email);
      setOtp(["", "", "", "", "", ""]);
      setAutoSubmitEnabled(true);
      inputs.current[0]?.focus();
    });
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-5 w-full items-stretch sm:px-8"
    >
      <div className="mb-5 text-center">
        <h2 className="text-[22px] sm:text-[28px] font-bold text-[#17356f]">
          Enter Verification Code
        </h2>
        <p className="mt-2 text-[14px] sm:text-base text-[#6e7580]">
          We sent a code to your email
        </p>
      </div>

      <div className="flex justify-between gap-2 sm:gap-3 my-2">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            maxLength={1}
            value={otp[i]}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="h-11 sm:h-14 w-full rounded-xl sm:rounded-2xl border border-[#dce6f0] bg-white text-center text-lg sm:text-xl font-bold text-[#24529a] outline-none transition-all focus:border-[#24529a] shadow-sm"
          />
        ))}
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
      {resendMessage && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
          {resendMessage}
        </div>
      )}

      <div className="text-center text-sm text-[#6e7580]">
        <button
          onClick={handleResend}
          disabled={secondsLeft > 0}
          className="font-semibold text-[#17356f] underline underline-offset-2 disabled:text-[#b7c6dc] disabled:no-underline transition-all hover:cursor-pointer"
        >
          Resend
        </button>
        <span className="ml-2">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      <button
        onClick={handleVerify}
        disabled={isPending}
        className="mt-3 h-[50px] sm:h-[58px] w-full rounded-2xl bg-[#24529a] text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:bg-[#1f4685] disabled:opacity-70 cursor-pointer"
      >
        {isPending ? "Verifying..." : "Submit"}
      </button>
    </motion.div>
  );
}