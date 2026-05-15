"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRegisterStore } from "../../../store/useRegisterStore";
import Step1Personal from "./step-1-personal";
import Step2Account from "./step-2-account";
import Step3OTP from "./step-3-OTP";

const STEP_LABELS = ["Personal Details", "Account Setup", "Verification"];

export default function RegisterWizard() {
  const step = useRegisterStore((s) => s.step);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="mx-auto w-full max-w-[640px] rounded-[30px] border border-[#c8d6ee] bg-[#f9fbff] p-10"
    >
      <StepIndicator currentStep={step} />

      <AnimatePresence mode="wait">
        {step === 1 && <Step1Personal key="step1" />}
        {step === 2 && <Step2Account key="step2" />}
        {step === 3 && <Step3OTP key="step3" />}
      </AnimatePresence>

      <p className="mt-8 text-center text-sm text-[#5f6470]">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-[#17356f] underline underline-offset-2"
        >
          Login
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
