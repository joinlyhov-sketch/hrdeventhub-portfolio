"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useResetPasswordStore } from "../../../store/useResetPasswordStore";
import IdentifyStep from "./step-1-identify";
import VerifyStep from "./step-2-verify";
import NewPasswordStep from "./step-3-new-password";

const STEP_LABELS = ["Email Requirement", "Verification", "Done"];

export default function ResetPasswordWizard() {
  const step = useResetPasswordStore((s) => s.step);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="mx-auto w-full max-w-[700px] min-h-[600px] flex flex-col justify-between rounded-[30px] border border-[#c8d6ee] bg-[#f9fbff] p-8 sm:p-10 shadow-sm overflow-hidden"
    >
      <StepIndicator currentStep={step} />

      <div className="w-full flex flex-col flex-1 justify-center items-stretch my-4">
        <AnimatePresence mode="wait">
          {step === 1 && <IdentifyStep key="step1" />}
          {step === 2 && <VerifyStep key="step2" />}
          {step === 3 && <NewPasswordStep key="step3" />}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <div className="h-[1px] w-[80px] sm:w-[160px] bg-[#dce6f0]" />
        <span className="text-sm text-[#5f6470] whitespace-nowrap">
          Or Back to{" "}
          <button
            onClick={() => window.history.back()}
            className="font-bold text-[#1f4f98] underline decoration-2 underline-offset-4 hover:text-[#17356f] transition-colors cursor-pointer"
          >
            Login
          </button>
        </span>
        <div className="h-[1px] w-[80px] sm:w-[160px] bg-[#dce6f0]" />
      </div>
    </motion.div>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-10 sm:mb-14 flex items-center justify-center">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = currentStep >= stepNum;
        const isCompleted = currentStep > stepNum;
        const isLast = i === STEP_LABELS.length - 1;

        return (
          <div key={stepNum} className="flex items-center">
            <div className="relative flex flex-col items-center w-8 sm:w-10">
              <div
                className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all duration-500 z-10 ${
                  isActive
                    ? "bg-[#24529a] text-white shadow-lg shadow-blue-900/20"
                    : "bg-[#f0f2f5] text-[#94a3b8]"
                }`}
              >
                {stepNum}
              </div>

              <span
                className={`absolute top-9 sm:top-12 whitespace-nowrap text-[10px] sm:text-[13px] font-medium transition-colors duration-300 ${
                  isActive ? "text-[#17356f]" : "text-[#94a3b8]"
                }`}
              >
                {label}
              </span>
            </div>

            {!isLast && (
              <div className="relative h-[1.5px] w-10 sm:w-16 bg-[#e2e8f0] mx-1">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  className="absolute h-full bg-[#24529a]"
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}