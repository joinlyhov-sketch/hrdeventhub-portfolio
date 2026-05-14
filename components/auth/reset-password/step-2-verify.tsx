"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  resendOtpAction,
  verifyForgotPasswordAction,
} from "../../../actions/auth.action";
import { useResetPasswordStore } from "../../../store/useResetPasswordStore";

export default function VerifyStep() {
  const email = useResetPasswordStore((s) => s.email);
  const storeToken = useResetPasswordStore((s) => s.storeToken);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [secondsLeft, setSecondsLeft] = useState(300);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setError(null);
    setResendMessage(null);

    const code = otp.join("");
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
        return;
      }
      if (result?.ok && result.token) {
        storeToken(result.token);
      }
    });
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
      setResendMessage(
        result.message ?? "Verification OTP successfully resent.",
      );
      setSecondsLeft(300);
      setOtp(["", "", "", "", "", ""]);
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
      className="flex flex-col gap-5"
    >
      <div className="mb-5 text-center">
        <h2 className="text-[48px] font-extrabold tracking-[-2px] text-[#17356f]">
          Verify Your Email
        </h2>
        <p className="mt-2 text-[#6e7580]">We sent a code to your email</p>
      </div>

      <div className="flex justify-between gap-3 my-2">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            type="text"
            maxLength={1}
            value={otp[i]}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="h-[58px] w-full rounded-2xl border border-[#dce6f0] bg-white text-center text-xl font-bold text-[#24529a] outline-none transition-all focus:border-[#24529a] shadow-sm"
          />
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
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
        className="mt-3 h-[58px] w-full rounded-2xl bg-[#24529a] text-lg font-semibold text-white transition-all duration-300 hover:bg-[#1f4685] disabled:opacity-70 cursor-pointer"
      >
        {isPending ? "Verifying..." : "Submit"}
      </button>
    </motion.div>
  );
}