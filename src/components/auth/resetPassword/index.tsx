"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useResetPasswordStore } from "@/store/useResetPasswordStore";
import IdentifyStep from "./step-1-indentify";
import VerifyStep from "./step-2-verify";
import NewPasswordStep from "./step-3-new-password";

const STEP_LABELS = ["Identify", "Verify", "New Password"];

export default function ResetPasswordWizard() {
  const step = useResetPasswordStore((s) => s.step);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="mx-auto w-full max-w-[640px] rounded-[30px] border border-[#c8d6ee] bg-[#f9fbff] p-10"
    >
      <StepIndicator currentStep={step} />

      <AnimatePresence mode="wait">
        {step === 1 && <IdentifyStep key="step1" />}
        {step === 2 && <VerifyStep key="step2" />}
        {step === 3 && <NewPasswordStep key="step3" />}
      </AnimatePresence>

      <p className="mt-8 text-center text-sm text-[#5f6470]">
        Remembered your password?{" "}
        <a
          href="/login"
          className="font-semibold text-[#17356f] underline underline-offset-2"
        >
          Back to Login
        </a>
      </p>
    </motion.div>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-12 flex items-start justify-center">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = currentStep >= stepNum;
        const isLast = i === STEP_LABELS.length - 1;

        return (
          <div key={stepNum} className="flex items-start">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#24529a] text-white"
                    : "border border-[#cfd7e4] bg-white text-[#4d5663]"
                }`}
              >
                {stepNum}
              </div>
              <span className="mt-3 text-sm text-[#4d5663]">{label}</span>
            </div>

            {!isLast && (
              <div
                className={`mt-5 h-[2px] w-24 transition-all ${
                  currentStep > stepNum ? "bg-[#24529a]" : "bg-[#b7c6dc]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
