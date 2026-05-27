"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRegisterStore } from "../../../store/useRegisterStore";
import Step1Personal from "./step-1-personal";
import Step2Account from "./step-2-account";
import Step3OTP from "./step-3-OTP";

const registerStep = ["Personal Details", "Account Setup", "Verification"];

export default function RegisterWizard() {
  const step = useRegisterStore((s) => s.step);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="mx-auto w-[625px] min-h-[691px] rounded-[30px] border border-[#c8d6ee] bg-[#f9fbff] p-10 shadow-sm overflow-hidden"
    >
      <StepIndicator currentStep={step} />

      <div className="w-full flex flex-col items-stretch">
        <AnimatePresence mode="wait">
          {step === 1 && <Step1Personal key="step1" />}
          {step === 2 && <Step2Account key="step2" />}
          {step === 3 && <Step3OTP key="step3" />}
        </AnimatePresence>
      </div>

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
    <div className="mb-14 flex items-center justify-center">
      {registerStep.map((label, i) => {
        const stepNum = i + 1;
        const isActive = currentStep >= stepNum;
        const isCompleted = currentStep > stepNum;
        const isLast = i === registerStep.length - 1;

        return (
          <div key={stepNum} className="flex items-center">
            <div className="relative flex flex-col items-center w-10">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-500 z-10 ${
                  isActive
                    ? "bg-[#24529a] text-white shadow-lg shadow-blue-900/20"
                    : "bg-[#f0f2f5] text-[#94a3b8]"
                }`}
              >
                {stepNum}
              </div>

              <span
                className={`absolute top-12 whitespace-nowrap text-[13px] font-medium transition-colors duration-300 ${
                  isActive ? "text-[#17356f]" : "text-[#94a3b8]"
                }`}
              >
                {label}
              </span>
            </div>

            {!isLast && (
              <div className="relative h-[1.5px] w-16 bg-[#e2e8f0] mx-1">
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
