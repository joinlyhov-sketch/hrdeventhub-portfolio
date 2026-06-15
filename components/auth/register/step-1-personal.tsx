"use client";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { z } from "zod";
import { useRegisterStore } from "../../../store/useRegisterStore";
import { User, Calendar as CalendarIcon, ChevronDown, AlertCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/libs/utils";
import * as Flags from "country-flag-icons/react/3x2";

const itemVars: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const dob = new Date(val);
      if (isNaN(dob.getTime())) return false;
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const notYetHadBirthdayThisYear =
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());
      return age - (notYetHadBirthdayThisYear ? 1 : 0) >= 18;
    }, "You must be at least 18 years old to register"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^855\d{9}$/, "Please enter a valid 9-digit phone number"),
});

type Step1Errors = Partial<Record<keyof z.infer<typeof step1Schema>, string>>;

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function Step1Personal() {
  const form = useRegisterStore((s) => s.form);
  const updateField = useRegisterStore((s) => s.updateField);
  const setStep = useRegisterStore((s) => s.setStep);
  const [errors, setErrors] = useState<Step1Errors>({});
  const [genderOpen, setGenderOpen] = useState(false);

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

  const currentYear = new Date().getFullYear();
  const maxBirthYear = currentYear - 18;
  const minBirthYear = currentYear - 100;

  const maxDate = (() => {
    const d = new Date();
    d.setFullYear(maxBirthYear);
    return d;
  })();

  const startMonth = new Date(minBirthYear, 0);
  const endMonth = new Date(maxBirthYear, 11);

  const selectedDate = form.dateOfBirth ? parseISO(form.dateOfBirth) : undefined;

  const getDisplayPhoneNumber = () => {
    const raw = form.phoneNumber.startsWith("855")
      ? form.phoneNumber.slice(3)
      : form.phoneNumber;
    if (raw.length <= 2) return raw;
    if (raw.length <= 5) return `${raw.slice(0, 2)} ${raw.slice(2)}`;
    return `${raw.slice(0, 2)} ${raw.slice(2, 5)} ${raw.slice(5)}`;
  };

  return (
    <motion.div
      className="flex flex-col gap-3 sm:gap-5"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 20 }}
      variants={itemVars}
    >
      <div className="mb-2 sm:mb-5 text-center">
        <h2 className="text-[22px] sm:text-[28px] font-extrabold tracking-[-1px] sm:tracking-[-2px] text-[#17356f]">
          Create Your Account
        </h2>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#6e7580]">
          Join HRD EventHub &amp; Get started
        </p>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center gap-3 rounded-xl sm:rounded-2xl border bg-white px-3 sm:px-4 py-2.5 sm:py-3.5 transition-all focus-within:border-[#24529a] ${
                errors.firstName ? "border-red-400" : "border-[#dce6f0]"
              }`}
            >
              <User size={16} color="#b0bac9" strokeWidth={2} className="shrink-0" />
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
              className={`flex items-center gap-3 rounded-xl sm:rounded-2xl border bg-white px-3 sm:px-4 py-2.5 sm:py-3.5 transition-all focus-within:border-[#24529a] ${
                errors.lastName ? "border-red-400" : "border-[#dce6f0]"
              }`}
            >
              <User size={16} color="#b0bac9" strokeWidth={2} className="shrink-0" />
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

        <div className="flex flex-col gap-1 pt-2 sm:pt-4">
          <Popover open={genderOpen} onOpenChange={setGenderOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`relative flex items-center gap-3 w-full rounded-xl sm:rounded-2xl border bg-white px-3 sm:px-4 py-2.5 sm:py-3.5 text-left transition-all outline-none focus:border-[#24529a] cursor-pointer ${
                  errors.gender ? "border-red-400" : "border-[#dce6f0]"
                }`}
              >
                <User size={16} color="#b0bac9" strokeWidth={2} className="shrink-0" />
                <span className={cn("text-sm flex-1", form.gender ? "text-[#2d3748]" : "text-[#aab3c0]")}>
                  {form.gender
                    ? genderOptions.find((o) => o.value === form.gender)?.label
                    : "Gender"}
                </span>
                <ChevronDown
                  size={16}
                  color="#b0bac9"
                  strokeWidth={2}
                  className={`transition-transform duration-200 ${genderOpen ? "rotate-180" : ""}`}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-(--radix-popover-trigger-width) flex flex-col gap-1 p-2 rounded-xl sm:rounded-2xl shadow-md border border-[#dce6f0] bg-white"
              align="start"
              sideOffset={6}
            >
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    handleChange("gender", option.value);
                    setGenderOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-sm transition-colors cursor-pointer ${
                    form.gender === option.value
                      ? "bg-blue-50 text-[#24529a] font-semibold"
                      : "text-[#2d3748] hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                  {form.gender === option.value && (
                    <Check size={15} className="text-[#24529a]" />
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>
          {errors.gender && <FieldError message={errors.gender} />}
        </div>

        <div className="flex flex-col gap-1 pt-2 sm:pt-4">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`flex items-center gap-3 w-full rounded-xl sm:rounded-2xl border bg-white px-3 sm:px-4 py-2.5 sm:py-3.5 text-left transition-all outline-none focus:border-[#24529a] focus:ring-1 focus:ring-[#24529a] cursor-pointer ${
                  errors.dateOfBirth ? "border-red-400" : "border-[#dce6f0]"
                }`}
              >
                <CalendarIcon size={16} color="#b0bac9" strokeWidth={2} className="shrink-0" />
                <span
                  className={cn(
                    "text-sm w-full outline-none",
                    form.dateOfBirth ? "text-[#2d3748]" : "text-[#aab3c0]"
                  )}
                >
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "DD/MM/YYYY"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl" align="start" sideOffset={6}>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    const formattedStr = format(date, "yyyy-MM-dd");
                    handleChange("dateOfBirth", formattedStr);
                  }
                }}
                disabled={(date) => date > maxDate || date < startMonth}
                captionLayout="dropdown"
                startMonth={startMonth}
                endMonth={endMonth}
              />
            </PopoverContent>
          </Popover>
          {errors.dateOfBirth && <FieldError message={errors.dateOfBirth} />}
        </div>

        <div className="flex flex-col gap-1 pt-2 sm:pt-4">
          <div
            className={`flex items-center rounded-xl sm:rounded-2xl border bg-white overflow-hidden transition-all focus-within:border-[#24529a] ${
              errors.phoneNumber ? "border-red-400" : "border-[#dce6f0]"
            }`}
          >
            <div className="flex items-center gap-2 bg-gray-50 border-r border-[#dce6f0] h-11 sm:h-13.5 px-3 sm:px-4 select-none shrink-0 text-sm font-medium text-gray-500">
              <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/10 items-center justify-center shadow-sm">
                <Flags.KH className="w-full h-full object-cover" />
              </span>
              <span className="text-[#2d3748] ml-0.5">+855</span>
            </div>
            <Input
              type="tel"
              placeholder="89 124 5768"
              value={getDisplayPhoneNumber()}
              onChange={(e) => {
                const input = e.target.value.replace(/\D/g, "");
                if (!input) {
                  handleChange("phoneNumber", "");
                  return;
                }
                const rawDigits = input.startsWith("0") ? input.slice(1) : input;
                const capped = rawDigits.slice(0, 9);
                handleChange("phoneNumber", `855${capped}`);
              }}
              className="w-full border-0 rounded-none bg-transparent h-11 sm:h-13.5 text-sm outline-none focus-visible:ring-0 shadow-none placeholder:text-[#aab3c0] text-[#2d3748] px-3 sm:px-4"
            />
          </div>
          {errors.phoneNumber && <FieldError message={errors.phoneNumber} />}
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="mt-2 sm:mt-3 h-11 sm:h-14.5 w-full rounded-xl sm:rounded-2xl bg-[#24529a] text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:bg-[#1f4685] cursor-pointer"
      >
        Next
      </button>
    </motion.div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 px-1">
      <AlertCircle size={13} className="shrink-0" />
      {message}
    </p>
  );
}