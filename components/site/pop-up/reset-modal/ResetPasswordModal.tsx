"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { useTransition, useEffect } from "react";
import { useResetPasswordStore } from "@/store/useResetPasswordAdminStore";
import { useCurrentUser } from "@/context/user-context";
import ConfirmStep from "./step-1-confirm";
import VerifyStep from "./step-2-verify";
import NewPasswordStep from "./step-3-new-password";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEP_LABELS = [
  "Step 1: Request Confirmation",
  "Step 2: Enter Verification Code",
  "Step 3: Choose New Password",
];

export default function ResetPasswordModal({ isOpen, onClose }: ResetPasswordModalProps) {
  const step = useResetPasswordStore((s) => s.step);
  const reset = useResetPasswordStore((s) => s.reset);
  const setEmail = useResetPasswordStore((s) => s.setEmail);
  const [isPending, startTransition] = useTransition();
  const { currentUser, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isOpen) {
      reset();
      if (currentUser?.email) {
        setEmail(currentUser.email);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50" />

        <Dialog.Content
          onPointerDownOutside={(e) => { if (isPending) e.preventDefault(); }}
          onInteractOutside={(e) => { if (isPending) e.preventDefault(); }}
          onEscapeKeyDown={(e) => { if (isPending) e.preventDefault(); }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] bg-[#f9fbff] rounded-[24px] shadow-xl border border-[#c8d6ee] z-50 overflow-hidden outline-none flex flex-col min-h-[500px]"
        >
          <div className="bg-slate-50/50 border-b border-[#dce6f0] p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <Dialog.Title className="text-lg font-bold text-[#17356f] tracking-tight">
                Reset Account Password
              </Dialog.Title>
              <p className="text-xs font-semibold text-[#24529a] tracking-wide mt-0.5">
                {STEP_LABELS[step - 1] ?? "Security Verification"}
              </p>
            </div>
            <button
              disabled={isPending}
              onClick={handleClose}
              className="text-[#94a3b8] hover:text-[#17356f] p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-between grow">
            <div className="mb-6 grow flex flex-col justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 text-[#6e7580]">
                  <Loader2 className="animate-spin text-[#24529a]" size={24} />
                  <p className="text-sm">Verifying profile secure context...</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <ConfirmStep key="step1" startTransition={startTransition} isPending={isPending} />
                  )}
                  {step === 2 && (
                    <VerifyStep key="step2" startTransition={startTransition} isPending={isPending} />
                  )}
                  {step === 3 && (
                    <NewPasswordStep key="step3" startTransition={startTransition} isPending={isPending} handleClose={handleClose} />
                  )}
                </AnimatePresence>
              )}
            </div>

            <div className="pt-4 border-t border-[#dce6f0] flex items-center justify-between">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                      step >= s ? "bg-[#24529a]" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-[#6e7580]">Step {step} of 3</span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}