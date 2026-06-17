"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { resendOtpAction, verifyOtpAction } from "../../../actions/auth.action";
import { useRegisterStore } from "../../../store/useRegisterStore";
import { toast } from "sonner";
import { LeaveVerificationModal } from "@/components/site/pop-up/leave-verification-modal";

function secondsFromExpiry(expiresAt: number | null): number {
  if (!expiresAt) return 300;
  return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
}

export default function Step3OTP() {
  const otpEmail = useRegisterStore((s) => s.otpEmail);
  const otpExpiresAt = useRegisterStore((s) => s.otpExpiresAt);
  const goToOTP = useRegisterStore((s) => s.goToOTP);
  const reset = useRegisterStore((s) => s.reset);
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [autoSubmitEnabled, setAutoSubmitEnabled] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    secondsFromExpiry(otpExpiresAt),
  );

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
const searchParams = useSearchParams();
const redirectUrl = searchParams.get("redirect");

  useEffect(() => {
    const timer = window.setInterval(() => {
      const remaining = secondsFromExpiry(otpExpiresAt);
      setSecondsLeft(remaining);
      if (remaining <= 0) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpExpiresAt]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      setIsLeaveModalOpen(true);
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleConfirmLeave = () => {
    localStorage.clear();
    reset();
    setIsLeaveModalOpen(false);
    router.push("/sign-up");
  };

  const submitOtp = useCallback(
    (code: string) => {
      setError(null);
      setSuccess(null);
      setResendMessage(null);

      if (!otpEmail) {
        setError("Email is missing. Please register again.");
        return;
      }
      if (code.length !== 6) {
        setError("Please enter the 6-digit OTP.");
        return;
      }

      startTransition(async () => {
        const result = await verifyOtpAction(otpEmail, code);
        if (result?.error) {
          setError(result.error);
          setAutoSubmitEnabled(false);
          return;
        }
        if (result?.ok) {
  setSuccess(result.message ?? "Verification successful.");
  reset();
  toast.success(
    "Your account is ready. Sign in now to start exploring your dashboard.",
  );
  setTimeout(() => {
    router.push(redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login");
  }, 300);
}
      });
    },
    [otpEmail, reset, router, startTransition],
  );

  const handleVerify = () => submitOtp(otp.join(""));

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    const isFilled = newOtp.every((digit) => digit !== "");
    if (isFilled && autoSubmitEnabled && !isPending) {
      submitOtp(newOtp.join(""));
    }
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      if (index + i < 6) newOtp[index + i] = char;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(index + pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
    const isFilled = newOtp.every((digit) => digit !== "");
    if (isFilled && autoSubmitEnabled && !isPending) submitOtp(newOtp.join(""));
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    if (!otpEmail) {
      setError("Email is missing. Please register again.");
      return;
    }
    setError(null);
    setResendMessage(null);

    startTransition(async () => {
      const result = await resendOtpAction(otpEmail);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setResendMessage(
        result.message ?? "Verification OTP successfully resent.",
      );
      goToOTP(otpEmail);
      setOtp(["", "", "", "", "", ""]);
      setAutoSubmitEnabled(true);
      inputRefs.current[0]?.focus();
    });
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <>
      <motion.div
        className="flex flex-col gap-4 sm:gap-5 w-full items-stretch sm:px-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-3 sm:mb-5 text-center">
          <h2 className="text-[22px] sm:text-[28px] font-extrabold tracking-[-1px] sm:tracking-[-2px] text-[#17356f]">
            Enter Verification Code
          </h2>
          <p className="mt-1 sm:mt-2 text-sm text-[#6e7580]">
            We sent a code to your email
          </p>
        </div>

        <div className="flex justify-between gap-2 sm:gap-3 my-1 sm:my-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e, index)}
              className="
                h-11 w-full
                sm:h-14
                rounded-xl sm:rounded-2xl
                border border-[#dce6f0] bg-white
                text-center text-lg sm:text-xl font-bold text-[#24529a]
                outline-none transition-all focus:border-[#24529a] shadow-sm
              "
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
            className="font-semibold text-[#17356f] underline underline-offset-2 disabled:text-[#b7c6dc] disabled:no-underline transition-all"
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
          className="mt-2 sm:mt-3 h-[50px] sm:h-[58px] w-full rounded-xl sm:rounded-2xl bg-[#24529a] text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:bg-[#1f4685] disabled:opacity-70 cursor-pointer"
        >
          {isPending ? "Verifying..." : "Submit"}
        </button>
      </motion.div>

      <LeaveVerificationModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleConfirmLeave}
      />
    </>
  );
}