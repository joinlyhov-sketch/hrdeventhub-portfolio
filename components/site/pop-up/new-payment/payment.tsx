"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { useCurrentUser } from "@/context/user-context";
import { useSession } from "next-auth/react";
import {
  studentRegisterAction,
  alumniFixedPaymentAction,
  generateFlexibleQrAction,
  alumniFlexiblePaymentAction,
} from "@/actions/payment.action";
import { generateBillNo } from "./billno";
import { StepIndicator } from "./indicator";
import { AmountStep } from "./amount-step";
import { QrStep } from "./qr-step";
import { RemarkStep } from "./remark-step";
import { SuccessStep } from "./success-step";
import { ReceiptStep } from "./receipt-step";
import type { Transaction, GenerateQrResponse } from "@/service/payment.service";
import type { Post } from "@/types/posts";

interface PaymentWizardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

type UserRole = "student" | "alumni" | "admin" | "organizer";
type PaymentType = "fixed" | "flexible" | "free";
type WizardFlow = "student-free" | "alumni-fixed" | "alumni-flexible" | "not-allowed";
type AnyStep = "amount" | "qr" | "confirm" | "success" | "receipt";

function resolveFlow(role: UserRole, paymentType: PaymentType | null): WizardFlow {
  if (role !== "student" && role !== "alumni") return "not-allowed";
  if (role === "student") return "student-free";
  if (paymentType === "flexible") return "alumni-flexible";
  return "alumni-fixed";
}

export function PaymentWizardDialog({ isOpen, onClose, post }: PaymentWizardDialogProps) {
  const { currentUser } = useCurrentUser();
  const { data: session } = useSession();

  const payment = post?.payment;
  const paymentType = (payment?.paymentType ?? "fixed") as "fixed" | "flexible";
  const fixedAmount = payment?.paymentAmount ?? 0;
  const donationGoal = payment?.donationGoal ?? 0;
  const amountRaised = payment?.amountRaised ?? 0;

  const flow = useMemo(() => {
    if (!currentUser) return null;
    return resolveFlow(currentUser.role as UserRole, paymentType);
  }, [currentUser, paymentType]);

  const initialStep = useMemo((): AnyStep => {
    if (!flow) return "confirm";
    const map: Record<WizardFlow, AnyStep> = {
      "student-free":    "confirm",
      "alumni-fixed":    "qr",
      "alumni-flexible": "amount",
      "not-allowed":     "confirm",
    };
    return map[flow];
  }, [flow]);

  const [step, setStep] = useState<AnyStep>("confirm");
  const [remark, setRemark] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const [billNo, setBillNo] = useState("");
  const [requestId, setRequestId] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");

  const [donationAmount, setDonationAmount] = useState("");
  const [donationAmountError, setDonationAmountError] = useState<string | null>(null);
  const [flexQrData, setFlexQrData] = useState<GenerateQrResponse | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (flow && isOpen) {
      setStep(initialStep);
    }
  }, [flow, isOpen, initialStep]);

  useEffect(() => {
    if (isOpen && flow === "alumni-fixed" && currentUser?.name && !billNo) {
      const generated = generateBillNo(currentUser.name);
      setBillNo(generated);
      setRequestId(payment?.requestId ?? "");
    }
  }, [isOpen, flow, currentUser?.name, billNo, payment?.requestId]);

  useEffect(() => {
    const khqr = flow === "alumni-fixed" ? payment?.khqrData : flexQrData?.khqrData;
    if (!khqr) return;
    QRCode.toDataURL(khqr, {
      width: 240,
      margin: 2,
      color: { dark: "#1e3a8a", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [flow, payment?.khqrData, flexQrData?.khqrData]);

  const handleClose = () => {
    if (isSubmittingRef.current) return;
    setRemark("");
    setBillNo("");
    setRequestId("");
    setQrDataUrl("");
    setDonationAmount("");
    setDonationAmountError(null);
    setFlexQrData(null);
    setSubmitError(null);
    setTransaction(null);
    setSuccessMessage("");
    setIsSubmitting(false);
    onClose();
  };

  const handleGenerateQr = async () => {
    if (!currentUser?.role) return;
    const parsed = parseFloat(donationAmount);
    if (!donationAmount || isNaN(parsed) || parsed <= 0) {
      setDonationAmountError("Please enter a valid donation amount.");
      return;
    }
    setDonationAmountError(null);
    setIsGeneratingQr(true);
    setSubmitError(null);

    const result = await generateFlexibleQrAction({
      postId: post.postId,
      amount: parsed,
      role: currentUser.role,
    });
    setIsGeneratingQr(false);

    if (result.ok && result.payload) {
      setFlexQrData(result.payload);
      setBillNo(result.payload.billNo);
      setRequestId(result.payload.requestId);
      setStep("qr");
    } else {
      setSubmitError(result.error ?? "Failed to generate QR. Please try again.");
    }
  };

  const handleAlumniConfirm = async () => {
    if (isSubmittingRef.current) return;
    if (!currentUser?.name || !billNo || !requestId || !currentUser?.role) {
      setSubmitError("Missing payment details. Please go back and try again.");
      return;
    }

    console.log("[PaymentWizard] flexible state before submit:", {
      flexQrData_billNo: flexQrData?.billNo,
      flexQrData_requestId: flexQrData?.requestId,
      stateBillNo: billNo,
      stateRequestId: requestId,
    });

    console.log("[PaymentWizard] handleAlumniConfirm — payload being sent:", {
      billNo,
      requestId,
      payerName: currentUser?.name,
      remark: remark.trim() || "—",
      amount: flow === "alumni-flexible" ? (flexQrData?.amount ?? parseFloat(donationAmount)) : fixedAmount,
      postId: post.postId,
      role: currentUser?.role,
    });

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    const amount = flow === "alumni-flexible" ? (flexQrData?.amount ?? parseFloat(donationAmount)) : fixedAmount;
    const action = flow === "alumni-flexible" ? alumniFlexiblePaymentAction : alumniFixedPaymentAction;

    const result = await action({
      billNo,
      requestId,
      payerName: currentUser.name,
      remark: remark.trim() || "—",
      amount,
      postId: post.postId,
      role: currentUser.role,
    });

    isSubmittingRef.current = false;
    setIsSubmitting(false);

    if (result.ok && result.payload) {
      setTransaction(result.payload);
      setStep("receipt");
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  const handleStudentConfirm = async () => {
    if (isSubmittingRef.current) return;
    if (!currentUser?.role) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await studentRegisterAction({
      postId: post.postId,
      remark: remark.trim() || "—",
      role: currentUser.role,
    });

    isSubmittingRef.current = false;
    setIsSubmitting(false);

    if (result.ok && result.payload) {
      setSuccessMessage(result.payload.message);
      setStep("success");
    } else {
      setSubmitError(result.error ?? "Registration failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  if (!currentUser || !flow) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[480px] w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden [&>button]:hidden gap-0">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-300" size={28} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (flow === "not-allowed") {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[480px] w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden [&>button]:hidden gap-0">
          <div className="relative border-b border-gray-100 bg-white px-8 pt-7 pb-4">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-[22px] font-bold text-[#1e3a8a]">Access Restricted</DialogTitle>
              <DialogDescription className="text-[14px] text-gray-500">
                Event registration is only available for students and alumni.
              </DialogDescription>
            </DialogHeader>
            <button onClick={handleClose} className="absolute right-7 top-7 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>
          <div className="px-8 py-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <p className="text-[14px] text-gray-500 text-center">
              Your account role does not have access to register for events.
            </p>
            <Button onClick={handleClose} className="h-[48px] px-8 rounded-xl font-semibold text-[15px] bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const displayAmount = flow === "alumni-flexible" ? `$${(flexQrData?.amount ?? 0).toFixed(2)} USD` : `$${fixedAmount.toFixed(2)} USD`;
  const isStudentFlow = flow === "student-free";
  const confirmAmount = isStudentFlow ? "Free" : displayAmount;
  const confirmBillNo = isStudentFlow ? "———" : billNo;

  const stepMeta: Partial<Record<AnyStep, { title: string; description: string }>> = {
    amount:  { title: "Choose Your Donation", description: "Every contribution brings us closer to the goal." },
    qr:      { title: "Pay with KHQR", description: "Scan with ABA, Wing, or any KHQR-supported app." },
    confirm: {
      title: isStudentFlow ? "Confirm Registration" : "Almost Done",
      description: isStudentFlow ? "Review your details and confirm your free registration." : "Review your payment and add an optional note.",
    },
    success: { title: "Registration Complete", description: "See you at the event!" },
    receipt: { title: "Payment Complete", description: "Here's your transaction summary." },
  };

  const meta = stepMeta[step] ?? { title: "Register", description: "" };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[480px] w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden [&>button]:hidden gap-0">
        <div className="relative border-b border-gray-100 bg-white px-8 pt-7 pb-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-[22px] font-bold text-[#1e3a8a]">{meta.title}</DialogTitle>
            <DialogDescription className="text-[14px] text-gray-500 font-normal">{meta.description}</DialogDescription>
          </DialogHeader>
          <button onClick={handleClose} className="absolute right-7 top-7 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" aria-label="Close">
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="bg-white border-b border-gray-50">
          <StepIndicator flow={flow} current={step} />
        </div>

        <div className="px-8 py-6 bg-white overflow-y-auto max-h-[70vh]">
          {step === "amount" && (
            <AmountStep
              donationGoal={donationGoal}
              amountRaised={amountRaised}
              donationAmount={donationAmount}
              donationAmountError={donationAmountError}
              submitError={submitError}
              isGeneratingQr={isGeneratingQr}
              onAmountChange={setDonationAmount}
              onGenerateQr={handleGenerateQr}
            />
          )}
          {step === "qr" && (
            <QrStep
              displayAmount={displayAmount}
              qrDataUrl={qrDataUrl}
              billNo={billNo}
              onContinue={() => setStep("confirm")}
            />
          )}
          {step === "confirm" && (
            <RemarkStep
              post={post}
              isStudentFlow={isStudentFlow}
              confirmAmount={confirmAmount}
              payerName={currentUser?.name ?? "—"}
              confirmBillNo={confirmBillNo}
              remark={remark}
              onRemarkChange={setRemark}
              submitError={submitError}
              isSubmitting={isSubmitting}
              onBack={() => setStep("qr")}
              onSubmit={isStudentFlow ? handleStudentConfirm : handleAlumniConfirm}
            />
          )}
          {step === "success" && (
            <SuccessStep
              post={post}
              successMessage={successMessage}
              remark={remark}
              onClose={handleClose}
            />
          )}
          {step === "receipt" && (
            <ReceiptStep
              transaction={transaction}
              onClose={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}