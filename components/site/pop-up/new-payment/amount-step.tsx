"use client";

import { Target, TrendingUp, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AmountStepProps {
  donationGoal: number;
  amountRaised: number;
  donationAmount: string;
  donationAmountError: string | null;
  submitError: string | null;
  isGeneratingQr: boolean;
  onAmountChange: (value: string) => void;
  onGenerateQr: () => void;
}

export function AmountStep({
  donationGoal,
  amountRaised,
  donationAmount,
  donationAmountError,
  submitError,
  isGeneratingQr,
  onAmountChange,
  onGenerateQr,
}: AmountStepProps) {
  const progressPercent = donationGoal ? Math.min(100, Math.round((amountRaised / donationGoal) * 100)) : 0;
  return (
    <div className="flex flex-col gap-5 py-2">
      <div className="bg-blue-50/60 rounded-xl px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={15} className="text-[#1e3a8a]" />
            <span className="text-[13px] font-semibold text-[#1e3a8a]">Donation Goal</span>
          </div>
          <span className="text-[13px] font-bold text-[#1e3a8a]">${donationGoal.toLocaleString()} USD</span>
        </div>
        <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1e3a8a] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={13} className="text-green-500" />
            <span className="text-[12px] text-green-600 font-medium">
              ${amountRaised.toLocaleString()} raised
            </span>
          </div>
          <span className="text-[12px] text-gray-400">
            {progressPercent}% of goal
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[15px] font-bold text-[#1e3a8a] block">
          Your Donation Amount
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-gray-400 text-[15px] font-medium pointer-events-none">$</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={donationAmount}
            onChange={(e) => onAmountChange(e.target.value)}
            className={`h-[52px] pl-8 pr-16 rounded-xl border bg-white text-[15px] placeholder:text-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all ${
              donationAmountError ? "border-red-400" : "border-blue-100"
            }`}
          />
          <span className="absolute right-4 text-gray-400 text-[13px] pointer-events-none">USD</span>
        </div>
        {donationAmountError && (
          <p className="text-red-500 text-[13px]">{donationAmountError}</p>
        )}
      </div>

      {submitError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-[13px] text-red-600">{submitError}</p>
        </div>
      )}

      <Button
        onClick={onGenerateQr}
        disabled={isGeneratingQr}
        className="w-full h-[48px] rounded-xl font-semibold text-[15px] bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white shadow-md shadow-blue-900/10 transition-all disabled:opacity-50"
      >
        {isGeneratingQr ? (
          <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Generating QR…
          </span>
        ) : (
          <>Proceed <ChevronRight size={18} className="ml-1" /></>
        )}
      </Button>
    </div>
  );
}