"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/comment-modal/dialog";
import { usePaymentModalStore } from "@/store/usePaymentModalStore";
import { X } from "lucide-react";
import PaymentStepper from "./PaymentStepper";
import DonateAmountStep from "./step-process/DonatePaymentStep";
import PaymentSuccessStep from "./step-process/PaymentSuccessStep";
import RegisterInfoStep from "./step-process/RegisterInfoStep";
import ScanPaymentStep from "./step-process/ScanPaymentStep";

export default function PaymentModal() {
  const { isOpen, mode, step, closePaymentModal } = usePaymentModalStore();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) closePaymentModal();
      }}
    >
      <DialogContent
        className="
          h-[440px] w-[490px] max-w-none
          rounded-xl border border-border
          bg-card px-6 py-5 shadow-xl
          [&>button]:hidden 
        "
      >
        <DialogTitle className="sr-only">Payment modal</DialogTitle>

        <DialogClose asChild>
          <button
            onClick={closePaymentModal}
            title="Close payment modal"
            className="absolute right-4 top-4 z-10 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        </DialogClose>

        <div className="flex h-full flex-col">
          <PaymentStepper step={step} />

          <div className="min-h-0 flex-1">
            {step === 1 && mode === "register" && <RegisterInfoStep />}
            {step === 1 && mode === "donation" && <DonateAmountStep />}
            {step === 2 && <ScanPaymentStep />}
            {step === 3 && <PaymentSuccessStep />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
