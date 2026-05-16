"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { useRegisterStore } from "../../../store/useRegisterStore";
import { User, Calendar, Phone, ChevronDown, AlertCircle } from "lucide-react";

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
    .regex(/^\d{8,10}$/, "Phone number must be 8–10 digits"),
});

type Step1Errors = Partial<Record<keyof z.infer<typeof step1Schema>, string>>;

export default function Step1Personal() {
  const form = useRegisterStore((s) => s.form);
  const updateField = useRegisterStore((s) => s.updateField);
  const setStep = useRegisterStore((s) => s.setStep);

  const [errors, setErrors] = useState<Step1Errors>({});

  const handleNext = () => {
    const result = step1Schema.safeParse({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      phoneNumber: form.phoneNumber.trim(),
    });

    if (!result.success) {
      const fieldErrors: Step1Errors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof Step1Errors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };
  const handleChange = (field: keyof Step1Errors, value: string) => {
    updateField(field, value);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
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
        <p className="mt-2 text-[#6e7580]">Join HRD EventHub &amp; Get started</p>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-all focus-within:border-[#24529a] ${
                errors.firstName ? "border-red-400" : "border-[#dce6f0]"
              }`}
            >
              <User size={18} color="#b0bac9" strokeWidth={2} className="shrink-0" />
              <input
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
              />
            </div>
            {errors.firstName && <FieldError message={errors.firstName} />}
          </div>
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-all focus-within:border-[#24529a] ${
                errors.lastName ? "border-red-400" : "border-[#dce6f0]"
              }`}
            >
              <User size={18} color="#b0bac9" strokeWidth={2} className="shrink-0" />
              <input
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
              />
            </div>
            {errors.lastName && <FieldError message={errors.lastName} />}
          </div>
        </div>
        <div className="flex flex-col gap-1 pt-4">
          <div
            className={`relative flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-all focus-within:border-[#24529a] ${
              errors.gender ? "border-red-400" : "border-[#dce6f0]"
            }`}
          >
            <User size={18} color="#b0bac9" strokeWidth={2} className="shrink-0" />
            <select
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full appearance-none bg-transparent text-sm outline-none text-[#2d3748] cursor-pointer"
            >
              <option value="" disabled className="text-[#aab3c0]">
                Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <ChevronDown size={16} color="#b0bac9" strokeWidth={2} className="absolute right-4 pointer-events-none" />
          </div>
          {errors.gender && <FieldError message={errors.gender} />}
        </div>
        <div className="flex flex-col gap-1 pt-4">
          <div
            className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-all focus-within:border-[#24529a] ${
              errors.dateOfBirth ? "border-red-400" : "border-[#dce6f0]"
            }`}
          >
            <Calendar size={18} color="#b0bac9" strokeWidth={2} className="shrink-0" />
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              className={`w-full bg-transparent text-sm outline-none ${
                form.dateOfBirth ? "text-[#2d3748]" : "text-[#aab3c0]"
              }`}
              suppressHydrationWarning
            />
          </div>
          {errors.dateOfBirth && <FieldError message={errors.dateOfBirth} />}
        </div>

        <div className="flex flex-col gap-1 pt-4">
          <div
            className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-all focus-within:border-[#24529a] ${
              errors.phoneNumber ? "border-red-400" : "border-[#dce6f0]"
            }`}
          >
            <Phone size={18} color="#b0bac9" strokeWidth={2} className="shrink-0" />
            <input
              placeholder="+855  Phone number "
              value={form.phoneNumber}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                handleChange("phoneNumber", digits);
              }}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
            />
          </div>
          {errors.phoneNumber && <FieldError message={errors.phoneNumber} />}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="mt-3 h-[58px] w-full rounded-2xl bg-[#24529a] text-lg font-semibold text-white transition-all duration-300 hover:bg-[#1f4685] cursor-pointer"
      >
        Next
      </button>
    </motion.div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-sm text-red-500 px-1">
      <AlertCircle size={14} className="shrink-0" />
      {message}
    </p>
  );
}