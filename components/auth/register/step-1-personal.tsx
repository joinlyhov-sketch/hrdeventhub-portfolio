"use client";

import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useRegisterStore } from "../../../store/useRegisterStore";

const itemVars: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
   phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{8,10}$/, "Phone number must be 8–10 digits (e.g. 012345678)"),

});

export default function Step1Personal() {
  const form = useRegisterStore((s) => s.form);
  const updateField = useRegisterStore((s) => s.updateField);
  const setStep = useRegisterStore((s) => s.setStep);

  const [errors, setErrors] = useState<string[]>([]);
  const [mounted] = useState(true);

  const handleNext = () => {
    const result = step1Schema.safeParse({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      phoneNumber: form.phoneNumber.trim(),
    });

    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      return;
    }

    setErrors([]);
    setStep(2);
  };

  return (
    <motion.div
      className="flex flex-col gap-5"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 20 }}
      variants={itemVars}
    >
      <div className="mb-5 text-center">
        <h2 className="text-[48px] font-extrabold tracking-[-2px] text-[#17356f]">
          Create Your Account
        </h2>
        <p className="mt-2 text-[#6e7580]">
          Join HRD EventHub &amp; Get started
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-[#dce6f0] bg-white px-4 py-3.5 focus-within:border-[#24529a] transition-all">
            <UserIcon />
            <input
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#dce6f0] bg-white px-4 py-3.5 focus-within:border-[#24529a] transition-all">
            <UserIcon />
            <input
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
            />
          </div>
        </div>

        <div className="relative flex items-center gap-3 rounded-2xl border border-[#dce6f0] bg-white px-4 py-3.5 focus-within:border-[#24529a] transition-all">
          <UserIcon />
          <select
            value={form.gender}
            onChange={(e) => updateField("gender", e.target.value)}
            className="w-full appearance-none bg-transparent text-sm outline-none text-[#2d3748] cursor-pointer"
          >
            <option value="" disabled className="text-[#aab3c0]">
              Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative flex items-center gap-3 rounded-2xl border border-[#dce6f0] bg-white px-4 py-3.5 focus-within:border-[#24529a] transition-all">
          <CalendarIcon />
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
            className={`w-full bg-transparent text-sm outline-none ${
              form.dateOfBirth ? "text-[#2d3748]" : "text-[#aab3c0]"
            }`}
            suppressHydrationWarning
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#dce6f0] bg-white px-4 py-3.5 focus-within:border-[#24529a] transition-all">
          <PhoneIcon />
         <input
  placeholder="855+ Phone Number"
  value={form.phoneNumber}
  onChange={(e) => {
    const digits = e.target.value.replace(/\D/g, "");
    updateField("phoneNumber", digits);
  }}
  className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
/>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          <ul className="list-disc pl-4">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleNext}
        className="mt-3 h-[58px] w-full rounded-2xl bg-[#24529a] text-lg font-semibold text-white transition-all duration-300 hover:bg-[#1f4685] cursor-pointer"
      >
        Next
      </button>
    </motion.div>
  );
}

function UserIcon() {
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CalendarIcon() {
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function PhoneIcon() {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#b0bac9"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute right-4 pointer-events-none"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
