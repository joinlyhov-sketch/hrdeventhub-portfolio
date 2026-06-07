"use client";

import { Loader2, QrCode, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrStepProps {
  amount: number;
  qrDataUrl: string;
  billNo: string;
  onContinue: () => void;
}

export function QrStep({ amount, qrDataUrl, billNo, onContinue }: QrStepProps) {
  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div className="text-center space-y-1">
        <p className="text-[15px] text-gray-500">
          Scan the KHQR code below with your banking app
        </p>
        <p className="text-[22px] font-bold text-[#1e3a8a]">
          ${amount.toFixed(2)} USD
        </p>
      </div>

      <div className="relative p-3 bg-white rounded-2xl shadow-lg border border-blue-50">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="KHQR Payment Code" className="w-[200px] h-[200px]" />
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
          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Bill No.</p>
          <p className="text-[13px] font-bold text-[#1e3a8a] mt-0.5">{billNo || "Generating…"}</p>
        </div>
        <QrCode size={20} className="text-blue-300" />
      </div>

      <Button
        onClick={onContinue}
        className="w-full h-[48px] rounded-xl font-semibold text-[15px] bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white shadow-md shadow-blue-900/10 transition-all"
      >
        I've Paid — Continue
        <ChevronRight size={18} className="ml-1" />
      </Button>
    </div>
  );
}