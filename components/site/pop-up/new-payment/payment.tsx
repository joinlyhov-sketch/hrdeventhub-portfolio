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
import { DEMO_MODE } from "@/libs/demo/config";
import {
  studentRegisterAction,
  alumniFixedPaymentAction,
  generateFlexibleQrAction,
  alumniFlexiblePaymentAction,
  generateBakongQrAction,
  confirmBakongPaymentAction,
  checkBakongPaymentStatusAction,
} from "@/actions/payment.action";
import { generateBillNo } from "./billno";
import { StepIndicator } from "./indicator";
import { AmountStep } from "./amount-step";
import { QrStep } from "./qr-step";
import { RemarkStep } from "./remark-step";
import { SuccessStep } from "./success-step";
import { ReceiptStep } from "./receipt-step";
import { motion, AnimatePresence } from "framer-motion";
import type {
  Transaction,
  GenerateQrResponse,
  BakongQrGenerateResponse,
  PaymentProvider,
} from "@/service/payment.service";
import type { Post } from "@/types/posts";

interface PaymentWizardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  post: Post;
}

type UserRole = "student" | "alumni" | "admin" | "organizer";
type PaymentType = "fixed" | "flexible" | "free";

type WizardFlow =
  | "student-free"
  | "alumni-fixed"
  | "flexible-donation"
  | "not-allowed";

type AnyStep = "amount" | "qr" | "confirm" | "success" | "receipt";

function resolveFlow(
  role: UserRole,
  paymentType: PaymentType | null,
): WizardFlow {
  if (DEMO_MODE) return "student-free";
  if (role !== "student" && role !== "alumni") return "not-allowed";

  if (paymentType === "flexible") return "flexible-donation";

  if (role === "student") return "student-free";

  return "alumni-fixed";
}

export function PaymentWizardDialog({
  isOpen,
  onClose,
  onSuccess,
  post,
}: PaymentWizardDialogProps) {
  const { currentUser } = useCurrentUser();

  const payment = post?.payment;
  const paymentType = (payment?.paymentType ?? "fixed") as PaymentType;
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
      "student-free": "confirm",
      "alumni-fixed": "qr",
      "flexible-donation": "amount",
      "not-allowed": "confirm",
    };

    return map[flow];
  }, [flow]);

  const [step, setStep] = useState<AnyStep>("confirm");
  const [remark, setRemark] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProvider>("webill");

  const [billNo, setBillNo] = useState("");
  const [requestId, setRequestId] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");

  const [donationAmount, setDonationAmount] = useState("");
  const [donationAmountError, setDonationAmountError] = useState<string | null>(
    null,
  );

  const [flexQrData, setFlexQrData] = useState<GenerateQrResponse | null>(null);
  const [bakongQrData, setBakongQrData] =
    useState<BakongQrGenerateResponse | null>(null);

  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [isSkippingDonation, setIsSkippingDonation] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (
      isOpen &&
      flow === "alumni-fixed" &&
      selectedProvider === "webill" &&
      currentUser?.name &&
      !billNo
    ) {
      const generated = generateBillNo(currentUser.name);
      const requestIdValue = payment?.requestId ?? "";

      queueMicrotask(() => {
        setBillNo(generated);
        setRequestId(requestIdValue);
      });
    }
  }, [
    isOpen,
    flow,
    selectedProvider,
    currentUser?.name,
    billNo,
    payment?.requestId,
  ]);

  useEffect(() => {
    const khqr =
      selectedProvider === "bakong"
        ? bakongQrData?.khqrData
        : flow === "alumni-fixed"
          ? payment?.khqrData
          : flexQrData?.khqrData;

    if (!khqr) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(khqr, {
      width: 240,
      margin: 2,
      color: {
        dark: selectedProvider === "bakong" ? "#000000" : "#1e3a8a",
        light: "#ffffff"
      },
    }).then(setQrDataUrl);
  }, [
    selectedProvider,
    flow,
    payment?.khqrData,
    bakongQrData?.khqrData,
    flexQrData?.khqrData,
  ]);

  useEffect(() => {
    if (step !== "qr" || selectedProvider !== "bakong" || !bakongQrData?.paymentIntentId || isSubmitting) {
      return;
    }

    const intervalId = setInterval(async () => {
      if (isSubmittingRef.current) return;
      try {
        const result = await checkBakongPaymentStatusAction(bakongQrData.paymentIntentId);
        if (result.ok && result.payload?.paid) {
          clearInterval(intervalId);

          if (!currentUser?.role) return;

          isSubmittingRef.current = true;
          setIsSubmitting(true);

          const confirmResult = await confirmBakongPaymentAction({
            paymentIntentId: bakongQrData.paymentIntentId,
            postId: post.postId,
            role: currentUser.role,
            remark: remark.trim() || "—",
          });

          isSubmittingRef.current = false;
          setIsSubmitting(false);

          if (confirmResult.ok && confirmResult.payload) {
            setTransaction(confirmResult.payload);
            setStep("receipt");
          } else {
            setSubmitError(confirmResult.error ?? "Bakong payment confirmation failed.");
          }
        }
      } catch (err) {
        console.error("Bakong poll error:", err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [step, selectedProvider, bakongQrData?.paymentIntentId, isSubmitting, currentUser?.role, post.postId, remark]);

  const resetState = () => {
    setRemark("");
    setSelectedProvider("webill");
    setBillNo("");
    setRequestId("");
    setQrDataUrl("");
    setDonationAmount("");
    setDonationAmountError(null);
    setFlexQrData(null);
    setBakongQrData(null);
    setSubmitError(null);
    setTransaction(null);
    setSuccessMessage("");
    setIsSubmitting(false);
    setIsGeneratingQr(false);
    setIsSkippingDonation(false);
  };

  const handleClose = () => {
    if (isSubmittingRef.current) return;
    const isSuccess = step === "success" || step === "receipt";
    if (isSuccess) {
      resetState();
      setStep(initialStep);
      onSuccess?.();
    }
    onClose();
  };

  const handleForceClose = () => {
    if (isSubmittingRef.current) return;
    resetState();
    setStep(initialStep);
    onClose();
  };

  const prevContextRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const currentContext = `${post.postId}-${flow}`;
      if (prevContextRef.current !== currentContext) {
        resetState();
        setStep(initialStep);
        prevContextRef.current = currentContext;
      }
    }
  }, [isOpen, post.postId, flow, initialStep]);

  const handleFixedProviderChange = async (provider: PaymentProvider) => {
    if (!currentUser?.role) return;

    setSelectedProvider(provider);
    setSubmitError(null);
    setQrDataUrl("");
    setBakongQrData(null);

    if (provider === "webill") {
      const generated = generateBillNo(currentUser.name ?? "");
      setBillNo(generated);
      setRequestId(payment?.requestId ?? "");
      return;
    }


    setBillNo("");
    setRequestId("");
    setIsGeneratingQr(true);

    const result = await generateBakongQrAction({
      postId: post.postId,
      amount: fixedAmount,
      role: currentUser.role,
      remark: "",
    });

    setIsGeneratingQr(false);

    if (result.ok && result.payload) {
      setBakongQrData(result.payload);
      setBillNo(result.payload.billNo);
      setRequestId(result.payload.requestId);
    } else {
      setSubmitError(
        result.error ?? "Failed to generate Bakong QR. Please try again.",
      );
    }
  };

  const handleGenerateQr = async () => {
    if (!currentUser?.role) return;

    const parsed = parseFloat(donationAmount);

    if (!donationAmount || isNaN(parsed) || parsed <= 0) {
      setDonationAmountError(
        "Please enter a valid donation amount or skip donation.",
      );
      return;
    }

    setDonationAmountError(null);
    setIsSkippingDonation(false);
    setIsGeneratingQr(true);
    setSubmitError(null);
    setFlexQrData(null);
    setBakongQrData(null);
    setBillNo("");
    setRequestId("");
    setQrDataUrl("");

    if (selectedProvider === "bakong") {
      const result = await generateBakongQrAction({
        postId: post.postId,
        amount: parsed,
        role: currentUser.role,
        remark: "",
      });

      setIsGeneratingQr(false);

      if (result.ok && result.payload) {
        setBakongQrData(result.payload);
        setBillNo(result.payload.billNo);
        setRequestId(result.payload.requestId);
        setStep("qr");
      } else {
        setSubmitError(
          result.error ?? "Failed to generate Bakong QR. Please try again.",
        );
      }

      return;
    }

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
      setSubmitError(
        result.error ?? "Failed to generate QR. Please try again.",
      );
    }
  };

  const handleSkipDonation = () => {
    setDonationAmount("");
    setDonationAmountError(null);
    setSubmitError(null);
    setBillNo("");
    setRequestId("");
    setQrDataUrl("");
    setFlexQrData(null);
    setBakongQrData(null);
    setIsSkippingDonation(true);
    setStep("confirm");
  };

  const handlePaymentConfirm = async () => {
    if (isSubmittingRef.current) return;

    if (!currentUser?.name || !billNo || !requestId || !currentUser?.role) {
      setSubmitError("Missing payment details. Please go back and try again.");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    if (selectedProvider === "bakong") {
      if (!bakongQrData?.paymentIntentId) {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        setSubmitError("Missing Bakong payment intent. Please try again.");
        return;
      }

      const result = await confirmBakongPaymentAction({
        paymentIntentId: bakongQrData.paymentIntentId,
        postId: post.postId,
        role: currentUser.role,
        remark: remark.trim() || "—",
      });

      isSubmittingRef.current = false;
      setIsSubmitting(false);

      if (result.ok && result.payload) {
        setTransaction(result.payload);
        setStep("receipt");
      } else {
        setSubmitError(
          result.error ?? "Bakong payment confirmation failed.",
        );
      }

      return;
    }

    const isFlexibleDonation = flow === "flexible-donation";

    const amount = isFlexibleDonation
      ? flexQrData?.amount ?? parseFloat(donationAmount)
      : fixedAmount;

    const action = isFlexibleDonation
      ? alumniFlexiblePaymentAction
      : alumniFixedPaymentAction;

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

  const handleRegisterWithoutPayment = async () => {
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
        <DialogContent className="sm:max-w-[480px] w-[calc(100%-2rem)] sm:w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden [&>button]:hidden gap-0">
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
        <DialogContent className="sm:max-w-[480px] w-[calc(100%-2rem)] sm:w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden [&>button]:hidden gap-0">
          <div className="relative border-b border-gray-100 bg-white px-8 pt-7 pb-4">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-[22px] font-bold text-[#1e3a8a]">
                Access Restricted
              </DialogTitle>

              <DialogDescription className="text-[14px] text-gray-500">
                Event registration is only available for students and alumni.
              </DialogDescription>
            </DialogHeader>

            <button
              onClick={handleClose}
              className="absolute right-7 top-7 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Close"
            >
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

            <Button
              onClick={handleClose}
              className="h-[48px] px-8 rounded-xl font-semibold text-[15px] bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const isFlexibleDonation = flow === "flexible-donation";
  const isFreeRegistration = flow === "student-free";

  const activePaidAmount =
    selectedProvider === "bakong"
      ? bakongQrData?.amount ?? fixedAmount
      : isFlexibleDonation
        ? flexQrData?.amount
        : fixedAmount;

  const displayAmount = `$${(activePaidAmount ?? fixedAmount ?? 0).toFixed(
    2,
  )} USD`;

  const isNoPayment = isFreeRegistration || isSkippingDonation;

  const confirmAmount = isNoPayment ? "No donation" : displayAmount;
  const confirmBillNo = isNoPayment ? "———" : billNo;

  const successAmountLabel = isSkippingDonation ? "No donation" : "Free";

  const stepMeta: Partial<
    Record<AnyStep, { title: string; description: string }>
  > = {
    amount: {
      title: "Support This Event",
      description: "Add an optional donation or skip to register.",
    },
    qr: {
      title: "Pay with KHQR",
      description:
        selectedProvider === "bakong"
          ? "Scan or demo-confirm your Bakong payment."
          : "Scan with ABA, Wing, or any KHQR-supported app.",
    },
    confirm: {
      title: isNoPayment ? "Confirm Registration" : "Almost Done",
      description: isNoPayment
        ? "Review your details and confirm your registration."
        : "Review your payment and add an optional note.",
    },
    success: {
      title: "Registration Complete",
      description: "See you at the event!",
    },
    receipt: {
      title: "Payment Complete",
      description: "Here's your transaction summary.",
    },
  };

  const meta = stepMeta[step] ?? { title: "Register", description: "" };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        className="sm:max-w-[480px] w-[calc(100%-2rem)] sm:w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden [&>button]:hidden gap-0"
        onInteractOutside={(e) => {
          if (step !== initialStep) {
            e.preventDefault();
          }
        }}
      >
        <div className="relative border-b border-gray-100 bg-white px-5 sm:px-8 pt-5 sm:pt-7 pb-4">
          <DialogHeader className="space-y-1 pr-8">
            <DialogTitle className="text-[18px] sm:text-[22px] font-bold text-[#1e3a8a]">
              {meta.title}
            </DialogTitle>

            <DialogDescription className="text-[13px] sm:text-[14px] text-gray-500 font-normal">
              {meta.description}
            </DialogDescription>
          </DialogHeader>

          <button
            onClick={handleForceClose}
            className="absolute right-4 sm:right-7 top-4 sm:top-7 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="bg-white border-b border-gray-50">
          <StepIndicator
            flow={flow}
            current={step}
            isSkippingDonation={isSkippingDonation}
          />
        </div>

        <div className="px-4 sm:px-8 py-5 sm:py-6 bg-white overflow-y-auto max-h-[75vh] sm:max-h-[70vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {step === "amount" && (
                <AmountStep
                  donationGoal={donationGoal}
                  amountRaised={amountRaised}
                  donationAmount={donationAmount}
                  donationAmountError={donationAmountError}
                  submitError={submitError}
                  isGeneratingQr={isGeneratingQr}
                  selectedProvider={selectedProvider}
                  onProviderChange={setSelectedProvider}
                  onAmountChange={setDonationAmount}
                  onGenerateQr={handleGenerateQr}
                  onSkipDonation={handleSkipDonation}
                />
              )}

              {step === "qr" && (
                <QrStep
                  displayAmount={displayAmount}
                  qrDataUrl={qrDataUrl}
                  billNo={billNo}
                  provider={selectedProvider}
                  payerName={
                    selectedProvider === "bakong" 
                      ? "Dita Rector" 
                      : (currentUser?.name ?? "HRD EventHub")
                  }
                  isLoadingQr={isGeneratingQr}
                  submitError={submitError}
                  onProviderChange={
                    flow === "alumni-fixed" ? handleFixedProviderChange : undefined
                  }
                  onContinue={() => setStep("confirm")}
                />
              )}

              {step === "confirm" && (
                <RemarkStep
                  post={post}
                  isFreeRegistration={isFreeRegistration}
                  isSkippingDonation={isSkippingDonation}
                  confirmAmount={confirmAmount}
                  payerName={currentUser?.name ?? "—"}
                  confirmBillNo={confirmBillNo}
                  remark={remark}
                  onRemarkChange={setRemark}
                  submitError={submitError}
                  isSubmitting={isSubmitting}
                  onBack={() => {
                    if (isSkippingDonation) {
                      setStep("amount");
                      return;
                    }

                    setStep("qr");
                  }}
                  onSubmit={
                    isNoPayment
                      ? handleRegisterWithoutPayment
                      : handlePaymentConfirm
                  }
                />
              )}

              {step === "success" && (
                <SuccessStep
                  post={post}
                  successMessage={successMessage}
                  remark={remark}
                  amountLabel={successAmountLabel}
                  onClose={handleClose}
                />
              )}

              {step === "receipt" && (
                <ReceiptStep transaction={transaction} onClose={handleClose} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
