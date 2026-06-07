"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Post } from "@/types/posts";

interface RemarkStepProps {
  post: Post;
  amount: number;
  payerName: string | undefined;
  billNo: string;
  remark: string;
  onRemarkChange: (value: string) => void;
  submitError: string | null;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function RemarkStep({
  post,
  amount,
  payerName,
  billNo,
  remark,
  onRemarkChange,
  submitError,
  isSubmitting,
  onBack,
  onSubmit,
}: RemarkStepProps) {
  return (
    <div className="flex flex-col gap-5 py-2">
      <div className="space-y-1">
        <p className="text-[15px] text-gray-500">
          Add a note for your registration (optional). This will appear on your
          receipt.
        </p>
      </div>

      <div className="bg-blue-50/60 rounded-xl px-4 py-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[13px] text-gray-500">Event</span>
          <span className="text-[13px] font-semibold text-gray-800 max-w-[200px] text-right truncate">
            {post.title}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[13px] text-gray-500">Amount</span>
          <span className="text-[13px] font-bold text-[#1e3a8a]">
            ${amount.toFixed(2)} USD
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[13px] text-gray-500">Payer</span>
          <span className="text-[13px] font-semibold text-gray-800">
            {payerName ?? "—"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[13px] text-gray-500">Bill No.</span>
          <span className="text-[13px] font-mono text-gray-700">{billNo}</span>
        </div>
      </div>

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
          disabled={isSubmitting}
          className="flex-1 h-[48px] rounded-xl font-semibold text-[15px] border-blue-100 text-gray-600 hover:bg-blue-50 transition-all"
        >
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-[2] h-[48px] rounded-xl font-semibold text-[15px] bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white shadow-md shadow-blue-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Processing…
            </span>
          ) : (
            "Confirm Payment"
          )}
        </Button>
      </div>
    </div>
  );
}
