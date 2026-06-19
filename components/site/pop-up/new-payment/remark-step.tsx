"use client";

import { Gift, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SummaryCard } from "./summary-card";
import type { Post } from "@/types/posts";

interface RemarkStepProps {
  post: Post;
  isFreeRegistration: boolean;
  isSkippingDonation: boolean;
  confirmAmount: string;
  payerName: string;
  confirmBillNo: string;
  remark: string;
  onRemarkChange: (value: string) => void;
  submitError: string | null;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function RemarkStep({
  post,
  isFreeRegistration,
  isSkippingDonation,
  confirmAmount,
  payerName,
  confirmBillNo,
  remark,
  onRemarkChange,
  submitError,
  isSubmitting,
  onBack,
  onSubmit,
}: RemarkStepProps) {
  const isNoPayment = isFreeRegistration || isSkippingDonation;

  return (
    <div className="flex flex-col gap-5 py-2">
      {isNoPayment && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <Gift size={16} className="text-green-500 flex-shrink-0" />
          <p className="text-[13px] text-green-700 font-medium">
            {isSkippingDonation
              ? "You skipped the donation. Confirm your registration below."
              : "This event is free for you. Confirm your registration below."}
          </p>
        </div>
      )}

      <p className="text-[15px] text-gray-500">
        {isNoPayment
          ? "Add an optional note for your registration."
          : "Add a note for your registration (optional). This will appear on your receipt."}
      </p>

      <SummaryCard
        eventTitle={post.title}
        amount={confirmAmount}
        payerName={payerName}
        billNo={confirmBillNo}
      />

      <div className="space-y-2">
        <label className="text-[15px] font-bold text-[#1e3a8a] block">
          Remark{" "}
          <span className="font-normal text-gray-400 text-[13px]">
            (optional)
          </span>
        </label>

        <Textarea
          placeholder="e.g. I would like a vegetarian meal option…"
          value={remark}
          onChange={(e) => onRemarkChange(e.target.value)}
          className="min-h-[100px] resize-none p-4 rounded-xl border border-blue-100 bg-white text-[15px] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all"
        />
      </div>

      {submitError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle
            size={16}
            className="text-red-400 mt-0.5 flex-shrink-0"
          />
          <p className="text-[13px] text-red-600">{submitError}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting || isFreeRegistration}
          className="flex-1 h-[48px] rounded-xl font-semibold text-[15px] border-blue-100 text-gray-600 hover:bg-blue-50 transition-all disabled:opacity-30"
        >
          Back
        </Button>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-[2] h-[48px] rounded-xl font-semibold text-[15px] bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white shadow-md shadow-blue-900/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              {isNoPayment ? "Registering…" : "Processing…"}
            </span>
          ) : isNoPayment ? (
            "Confirm Registration"
          ) : (
            "Confirm Payment"
          )}
        </Button>
      </div>
    </div>
  );
}