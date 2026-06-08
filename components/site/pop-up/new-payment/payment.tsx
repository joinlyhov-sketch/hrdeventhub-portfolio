"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useCurrentUser } from "@/context/user-context";
import { useSession } from "next-auth/react";
import { submitPaymentAction } from "@/actions/payment.action";
import type { Transaction } from "@/service/payment.service";
import type { Post } from "@/types/posts";
import { generateBillNo } from "./billno";

import { StepIndicator } from "./indicator";
import { QrStep } from "./qr-step";
import { RemarkStep } from "./remark-step";
import { ReceiptStep } from "./receipt-step";

interface PaymentWizardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

type Step = "qr" | "remark" | "receipt";

export function PaymentWizardDialog({
  isOpen,
  onClose,
  post,
}: PaymentWizardDialogProps) {
  const isSubmittingRef = useRef(false);
  const { currentUser } = useCurrentUser();
  const { data: session } = useSession();

  const payment = post?.payment;
  const khqrData = payment?.khqrData ?? "";
  const requestId = payment?.requestId ?? "";
  const amount = payment?.paymentAmount ?? 0;

  const [step, setStep] = useState<Step>("qr");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [remark, setRemark] = useState("");
  const [billNo, setBillNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (isOpen && currentUser?.name && !billNo) {
      setBillNo(generateBillNo(currentUser.name));
    }
  }, [isOpen, currentUser?.name, billNo]);

  useEffect(() => {
    if (!khqrData) return;
    QRCode.toDataURL(khqrData, {
      width: 240,
      margin: 2,
      color: { dark: "#1e3a8a", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [khqrData]);

  const handleClose = () => {
    if (isSubmittingRef.current) return;
    setStep("qr");
    setRemark("");
    setBillNo("");
    setSubmitError(null);
    setTransaction(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleAlreadyPaid = async () => {
    if (isSubmittingRef.current) return;

    if (!currentUser?.name) {
      setSubmitError("User session not found. Please refresh and try again.");
      return;
    }

    if (!billNo) {
      setSubmitError("Bill number not generated yet. Please wait a moment.");
      return;
    }

    if (!requestId) {
      setSubmitError("Payment configuration is missing. Please reload the page.");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitPaymentAction({
        billNo,
        requestId,
        payerName: currentUser.name,
        remark: remark.trim() || "—",
        amount,
        postId: post.postId,
      });

      if (result.ok && result.payload) {
        setTransaction(result.payload);
        setStep("receipt");
      } else {
        setSubmitError(result.error ?? "Something went wrong. Please try again.");
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const stepTitles: Record<Step, { title: string; description: string }> = {
    qr: {
      title: "Pay with KHQR",
      description: "Scan the code with ABA, Wing, or any KHQR-supported app.",
    },
    remark: {
      title: "Almost Done",
      description: "Review your payment and add an optional note.",
    },
    receipt: {
      title: "Payment Complete",
      description: "Here's your transaction summary.",
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[480px] w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden [&>button]:hidden gap-0">
        <div className="relative border-b border-gray-100 bg-white px-8 pt-7 pb-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-[22px] font-bold text-[#1e3a8a]">
              {stepTitles[step].title}
            </DialogTitle>
            <DialogDescription className="text-[14px] text-gray-500 font-normal">
              {stepTitles[step].description}
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={handleClose}
            className="absolute right-7 top-7 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="bg-white border-b border-gray-50">
          <StepIndicator current={step} />
        </div>

        <div className="px-8 py-6 bg-white overflow-y-auto max-h-[70vh]">
          {step === "qr" && (
            <QrStep
              amount={amount}
              qrDataUrl={qrDataUrl}
              billNo={billNo}
              onContinue={() => setStep("remark")}
            />
          )}

          {step === "remark" && (
            <RemarkStep
              post={post}
              amount={amount}
              payerName={currentUser?.name}
              billNo={billNo}
              remark={remark}
              onRemarkChange={setRemark}
              submitError={submitError}
              isSubmitting={isSubmitting}
              onBack={() => setStep("qr")}
              onSubmit={handleAlreadyPaid}
            />
          )}

          {step === "receipt" && (
            <ReceiptStep transaction={transaction} onClose={handleClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}