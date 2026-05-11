"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { registerAction } from "@/actions/auth.action";
import type { RegisterRequest } from "@/libs/authType/type";
import { useRegisterStore } from "@/store/useRegisterStore";

export default function Step2Account() {
  const form = useRegisterStore((s) => s.form);
  const updateField = useRegisterStore((s) => s.updateField);
  const setStep = useRegisterStore((s) => s.setStep);
  const goToOTP = useRegisterStore((s) => s.goToOTP);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload: RegisterRequest = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender ? form.gender[0].toUpperCase() : "",
      email: form.email.trim(),
      password: form.password,
      dateOfBirth: form.dateOfBirth,
      phoneNumber: form.phoneNumber.trim(),
    };

    const missingFields = Object.entries(payload)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setError(`Please fill: ${missingFields.join(", ")}`);
      return;
    }

    startTransition(async () => {
      const result = await registerAction(payload);
      if (result?.error) {
        setError(result.error);
        return;
      }
      if (result?.ok) {
        goToOTP(form.email);
      }
    });
  };

  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="mb-5 text-center">
        <h2 className="text-[48px] font-extrabold tracking-[-2px] text-[#17356f]">
          Account Info
        </h2>
        <p className="mt-2 text-[#6e7580]">
          Join HRD EventHub &amp; Get started
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[#dce6f0] bg-white px-4 py-3.5 focus-within:border-[#24529a] transition-all">
          <EmailIcon />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#dce6f0] bg-white px-4 py-3.5 focus-within:border-[#24529a] transition-all">
          <LockIcon />
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
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
            placeholder="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
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

      <div className="mt-3 flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="h-[58px] flex-1 rounded-2xl border border-[#c8d6ee] bg-white text-lg font-semibold text-[#17356f] transition-all duration-300 hover:bg-[#f0f5ff] cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={handleRegister}
          disabled={isPending}
          className="h-[58px] flex-1 rounded-2xl bg-[#24529a] text-lg font-semibold text-white transition-all duration-300 hover:bg-[#1f4685] disabled:opacity-70 cursor-pointer"
        >
          {isPending ? "Registering..." : "Register"}
        </button>
      </div>
    </motion.div>
  );
}

function EmailIcon() {
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
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
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
