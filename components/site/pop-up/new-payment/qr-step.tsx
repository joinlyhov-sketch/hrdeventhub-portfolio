"use client";

import { Loader2, QrCode, ChevronRight, CreditCard, Landmark } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { PaymentProvider } from "@/service/payment.service";

interface QrStepProps {
  displayAmount: string;
  qrDataUrl: string;
  billNo: string;
  provider: PaymentProvider;
  isLoadingQr?: boolean;
  submitError?: string | null;
  onProviderChange?: (value: PaymentProvider) => void;
  onContinue: () => void;
}

export function QrStep({
  displayAmount,
  qrDataUrl,
  billNo,
  provider,
  isLoadingQr = false,
  submitError,
  onProviderChange,
  onContinue,
}: QrStepProps) {
  return (
    <div className="flex flex-col items-center gap-5 py-2">
      {onProviderChange && (
        <div className="w-full space-y-2">
          <label className="text-[15px] font-bold text-[#1e3a8a] block">
            Payment Method
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onProviderChange("webill")}
              disabled={isLoadingQr}
              className={`h-[52px] rounded-xl border px-3 flex items-center justify-center gap-2 text-[13px] font-semibold transition-all ${provider === "webill"
                  ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                  : "border-blue-100 bg-white text-gray-500 hover:bg-blue-50"
                }`}
            >
              <CreditCard size={16} />
              Webill365
            </button>

            <button
              type="button"
              onClick={() => onProviderChange("bakong")}
              disabled={isLoadingQr}
              className={`h-[52px] rounded-xl border px-3 flex items-center justify-center gap-2 text-[13px] font-semibold transition-all ${provider === "bakong"
                  ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                  : "border-blue-100 bg-white text-gray-500 hover:bg-blue-50"
                }`}
            >
              <Landmark size={16} />
              Bakong
            </button>
          </div>
        </div>
      )}

      <div className="text-center space-y-1">
        <p className="text-[15px] text-gray-500">
          Scan the KHQR code below with your banking app
        </p>
        <p className="text-[22px] font-bold text-[#1e3a8a]">{displayAmount}</p>
        <p className="text-[12px] text-gray-400">
          {provider === "bakong" ? "Bakong KHQR" : "Webill365 KHQR"}
        </p>
      </div>

      <div className="relative p-3 bg-white rounded-2xl shadow-lg border border-blue-50">
        {qrDataUrl && !isLoadingQr ? (
          <Image
            src={qrDataUrl}
            alt="KHQR Payment Code"
            width={200}
            height={200}
            unoptimized
          />
        ) : (
          <div className="w-[200px] h-[200px] flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-300" size={32} />
          </div>
        )}

        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#1e3a8a] rounded-tl-sm" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#1e3a8a] rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#1e3a8a] rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#1e3a8a] rounded-br-sm" />
      </div>

      <div className="w-full bg-blue-50/60 rounded-xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">
            Bill No.
          </p>
          <p className="text-[13px] font-bold text-[#1e3a8a] mt-0.5">
            {billNo || "Generating…"}
          </p>
        </div>
        <QrCode size={20} className="text-blue-300" />
      </div>

      {submitError && (
        <div className="w-full bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-[13px] text-red-600">{submitError}</p>
        </div>
      )}

      {provider === "bakong" ? (
        <div className="w-full flex items-center justify-center gap-2 h-[48px] rounded-xl font-semibold text-[15px] bg-[#1e3a8a]/10 text-[#1e3a8a] border border-[#1e3a8a]/20">
          <Loader2 className="animate-spin" size={18} />
          Waiting for payment...
        </div>
      ) : (
        <Button
          onClick={onContinue}
          disabled={isLoadingQr || !qrDataUrl || !billNo}
          className="w-full h-[48px] rounded-xl font-semibold text-[15px] bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white shadow-md shadow-blue-900/10 transition-all disabled:opacity-50"
        >
          I&apos;ve Paid — Continue <ChevronRight size={18} className="ml-1" />
        </Button>
      )}
    </div>
  );
}