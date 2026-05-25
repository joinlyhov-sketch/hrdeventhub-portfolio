"use client";

import { X } from "lucide-react";
import { usePaymentModalStore } from "../../../store/usePaymentStoreModal";
import PaymentStepper from "./PaymentStepper";
import RegisterInfoStep from "./steps/RegisterInfoStep";
import DonateAmountStep from "./steps/DonateAmountStep";
import ScanPaymentStep from "./steps/ScanPaymentStep";
import PaymentSuccessStep from "./steps/PaymentSuccessStep";

export default function PaymentModal() {
  const { isOpen, mode, step, closePaymentModal } = usePaymentModalStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-grey-900/30 backdrop-blur-[2px]">
      <div className="relative flex h-[610px] w-[370px] flex-col overflow-hidden rounded-xl border border-border bg-card px-6 py-5 shadow-xl">
        <button
          onClick={closePaymentModal}
          title="Close payment modal"
          aria-label="Close payment modal"
          className="absolute right-4 top-4 z-10 text-muted-foreground transition hover:text-foreground"
        >
          <X size={16} />
        </button>

        <div className="shrink-0">
          <PaymentStepper step={step} />
        </div>

        <div className="min-h-0 flex-1">
          {step === 1 && mode === "register" && <RegisterInfoStep />}
          {step === 1 && mode === "donation" && <DonateAmountStep />}
          {step === 2 && <ScanPaymentStep />}
          {step === 3 && <PaymentSuccessStep />}
        </div>
      </div>
    </div>
  );
}
