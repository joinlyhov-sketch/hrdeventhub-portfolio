"use client";

import { Loader2, QrCode, ChevronRight, Download } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { PaymentProvider } from "@/service/payment.service";

interface QrStepProps {
  displayAmount: string;
  qrDataUrl: string;
  billNo: string;
  provider: PaymentProvider;
  payerName?: string;
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
  payerName = "HRD EventHub",
  isLoadingQr = false,
  submitError,
  onProviderChange,
  onContinue,
}: QrStepProps) {
  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `KHQR_${billNo || "Payment"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col items-center gap-5 py-2 w-full">
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
              className={`h-14 rounded-xl border px-3 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed ${provider === "webill"
                ? "border-[#1e3a8a] bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-[#1e3a8a]/40 hover:bg-blue-50/50"
                }`}
            >
              <Image
                src="/images/webill365.svg"
                alt="Webill365"
                width={80}
                height={20}
                className="h-5 w-auto max-w-20 object-contain"
              />
            </button>

            <button
              type="button"
              onClick={() => onProviderChange("bakong")}
              disabled={isLoadingQr}
              className={`h-14 rounded-xl border px-3 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed ${provider === "bakong"
                ? "border-[#1e3a8a] bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-[#1e3a8a]/40 hover:bg-blue-50/50"
                }`}
            >
              <Image
                src="/images/bakong.png"
                alt="Bakong"
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
              <span className={`text-[13px] font-semibold ${provider === "bakong" ? "text-[#1e3a8a]" : "text-gray-500"}`}>
                Bakong
              </span>
            </button>
          </div>
        </div>
      )}

      <div className="text-center space-y-1 mb-2">
        {provider !== "bakong" && (
          <>
            <p className="text-[15px] text-gray-500">
              Scan the KHQR code below with your banking app
            </p>
            <p className="text-[22px] font-bold text-[#1e3a8a]">{displayAmount}</p>
          </>
        )}
        <p className="text-[12px] text-gray-400">
          {provider === "bakong" ? "Scan with any Bakong supported app" : "Webill365 KHQR"}
        </p>
      </div>

      {provider === "bakong" ? (
        <div className="w-full max-w-[280px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100 mx-auto transition-all hover:shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)]">
          {/* Top Red Header */}
          <div className="bg-[#E32B31] h-[60px] flex items-center justify-center relative shadow-sm">
            <span className="text-white font-bold tracking-widest text-xl flex items-center">
              KH<span className="font-light opacity-90">QR</span>
            </span>
            {/* Smooth diagonal fold effect at top-right */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-t-white border-l-[16px] border-l-transparent"></div>
          </div>

          {/* Info Section */}
          <div className="px-7 pt-6 pb-4 flex flex-col items-center text-center bg-gradient-to-b from-gray-50/50 to-white">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-1">
              DITA RECTOR
            </span>
            <span className="text-[32px] font-extrabold text-gray-900 leading-none tracking-tight">
              {displayAmount}
            </span>
          </div>

          {/* Dashed Line */}
          <div className="w-full relative px-6">
            <div className="w-full border-t-2 border-dashed border-gray-200"></div>
            {/* Edge cutouts */}
            <div className="absolute top-1/2 left-0 w-4 h-4 bg-white border-r border-gray-100 rounded-full -translate-x-2 -translate-y-1/2 shadow-inner"></div>
            <div className="absolute top-1/2 right-0 w-4 h-4 bg-white border-l border-gray-100 rounded-full translate-x-2 -translate-y-1/2 shadow-inner"></div>
          </div>

          {/* QR Code Section */}
          <div className="p-7 flex justify-center items-center bg-white relative">
            {qrDataUrl && !isLoadingQr ? (
              <div className="w-full flex flex-col items-center">
                <div className="relative p-1 bg-white rounded-xl shadow-sm border border-gray-100 inline-block">
                  <Image
                    src={qrDataUrl}
                    alt="KHQR Payment Code"
                    width={210}
                    height={210}
                    unoptimized
                    className="rounded-lg w-full max-w-[210px] h-auto aspect-square"
                  />
                  {/* Center Logo Overlay */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-full w-10 h-10 flex items-center justify-center border-4 border-white shadow-md transition-transform hover:scale-105">
                    <span className="text-white text-lg font-bold leading-none select-none">$</span>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="mt-4 flex items-center gap-1.5 text-[13px] font-bold text-[#1e3a8a] bg-blue-50/80 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-colors w-full justify-center shadow-sm"
                >
                  <Download size={16} /> Save QR Image
                </button>
              </div>
            ) : (
              <div className="w-full max-w-[210px] aspect-square flex flex-col items-center justify-center gap-3 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <Loader2 className="animate-spin text-gray-400" size={32} />
                <span className="text-xs text-gray-400 font-medium">Generating QR...</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative p-3 bg-white rounded-2xl shadow-lg border border-blue-50 w-full max-w-[280px] mx-auto">
          {qrDataUrl ? (
            <div className={`flex flex-col items-center ${isLoadingQr ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
              <Image
                src={qrDataUrl}
                alt="KHQR Payment Code"
                width={200}
                height={200}
                unoptimized
                className="w-full max-w-[200px] h-auto aspect-square"
              />
              <button
                onClick={handleDownload}
                className="mt-3 flex items-center gap-1.5 text-[13px] font-bold text-[#1e3a8a] bg-blue-50/80 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-colors w-full justify-center shadow-sm"
              >
                <Download size={16} /> Save QR Image
              </button>
            </div>
          ) : isLoadingQr ? (
            <div className="w-full aspect-square flex items-center justify-center">
              <Loader2 className="animate-spin text-gray-300" size={32} />
            </div>
          ) : (
            <div className="w-full aspect-square flex flex-col items-center justify-center text-center px-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <p className="text-[13px] text-gray-600 font-medium leading-snug">
                Webill is temporarily unavailable.
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Please select Bakong to proceed.
              </p>
            </div>
          )}

          {isLoadingQr && (
            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-2xl backdrop-blur-[2px]">
              <Loader2 className="animate-spin text-[#1e3a8a] mb-2" size={28} />
              <span className="text-xs font-semibold text-[#1e3a8a]">Loading QR...</span>
            </div>
          )}
        </div>
      )}

      <div className="w-full bg-blue-50/60 rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">
            Bill No.
          </p>
          <p className="text-[13px] font-bold text-[#1e3a8a] mt-0.5 truncate">
            {billNo || "Generating…"}
          </p>
        </div>
        <QrCode size={20} className="text-blue-300 shrink-0 ml-2" />
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