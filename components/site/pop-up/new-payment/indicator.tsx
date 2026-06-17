"use client";

import { CheckCircle2 } from "lucide-react";

type AnyStep = "amount" | "qr" | "confirm" | "success" | "receipt";

type WizardFlow =
  | "student-free"
  | "alumni-fixed"
  | "flexible-donation"
  | "not-allowed";

interface StepIndicatorProps {
  flow: WizardFlow;
  current: AnyStep;
  isSkippingDonation?: boolean;
}

const STEP_LABELS: Record<WizardFlow, { id: AnyStep; label: string }[]> = {
  "student-free": [
    { id: "confirm", label: "Register" },
    { id: "success", label: "Done" },
  ],

  "alumni-fixed": [
    { id: "qr", label: "Scan & Pay" },
    { id: "confirm", label: "Confirm" },
    { id: "receipt", label: "Receipt" },
  ],

  "flexible-donation": [
    { id: "amount", label: "Donate" },
    { id: "qr", label: "Scan & Pay" },
    { id: "confirm", label: "Confirm" },
    { id: "receipt", label: "Receipt" },
  ],

  "not-allowed": [],
};

const SKIP_DONATION_STEPS: { id: AnyStep; label: string }[] = [
  { id: "amount", label: "Donate" },
  { id: "confirm", label: "Register" },
  { id: "success", label: "Done" },
];

export function StepIndicator({
  flow,
  current,
  isSkippingDonation = false,
}: StepIndicatorProps) {
  const steps =
    flow === "flexible-donation" && isSkippingDonation
      ? SKIP_DONATION_STEPS
      : STEP_LABELS[flow];

  const currentIdx = steps.findIndex((s) => s.id === current);

  return (
    <div className="flex items-center justify-center gap-0 px-8 pt-2 pb-4">
      {steps.map((step, idx) => {
        const isDone = idx < currentIdx;
        const isActive = idx === currentIdx;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${
                  isDone
                    ? "bg-[#1e3a8a] text-white"
                    : isActive
                      ? "bg-[#1e3a8a] text-white ring-4 ring-blue-100"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {isDone ? <CheckCircle2 size={16} /> : idx + 1}
              </div>

              <span
                className={`text-[11px] font-medium whitespace-nowrap transition-colors ${
                  isActive || isDone ? "text-[#1e3a8a]" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`w-12 h-[2px] mb-5 mx-1 rounded-full transition-all duration-500 ${
                  isDone ? "bg-[#1e3a8a]" : "bg-gray-100"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}