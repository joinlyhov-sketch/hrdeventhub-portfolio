"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/libs/utils";
import QrScanner from "qr-scanner";
import type {
  CheckInResult,
  CheckInError,
} from "../../../../types/bottom-nav/types";
import { checkInAttendeeAction } from "@/actions/checkin.action";

interface Props {
  token: string;
  onClose: () => void;
  onSuccess: (result: CheckInResult) => void;
  onError: (err: CheckInError) => void;
}

declare class BarcodeDetector {
  constructor(options?: { formats: string[] });
  detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]>;
}

export function QRScannerModal({ token, onClose, onSuccess, onError }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const processingRef = useRef(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanLine, setScanLine] = useState(0);

  //animat scanline
  useEffect(() => {
    let dir = 1;
    let pos = 0;
    const id = setInterval(() => {
      pos += dir * 1.5;
      if (pos >= 100) dir = -1;
      if (pos <= 0) dir = 1;
      setScanLine(pos);
    }, 16);
    return () => clearInterval(id);
  }, []);

  const stopScanner = useCallback(() => {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
    scannerRef.current = null;
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    let cancelled = false;

    const scanner = new QrScanner(
      videoRef.current,
      async (result) => {
        if (processingRef.current || cancelled) return;
        if (!result.data) return;

        processingRef.current = true;
        stopScanner();

        const res = await checkInAttendeeAction(token, result.data);
        if (cancelled) return;

        if (res.success) {
          onSuccess(res.data);
        } else {
          onError(res.error);
        }
      },
      {
        preferredCamera: "environment",
        highlightScanRegion: false,
        highlightCodeOutline: false,
        maxScansPerSecond: 5,
      },
    );

    scannerRef.current = scanner;

    scanner.start().catch(() => {
      if (cancelled) return;
      setCameraError(
        "Camera access denied. Allow camera permission and try again.",
      );
    });

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [token, onSuccess, onError, stopScanner]);

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between px-5 pt-12 pb-4 border-b border-gray-100 dark:border-gray-900">
        <div className="flex flex-col items-start">
          <h2 className="text-[15px] font-semibold text-[#1c4d8d] dark:text-white">
            Scan QR code
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Point at attendees ticket
          </p>
        </div>
        <button
          onClick={() => {
            stopScanner();
            onClose();
          }}
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close scanner"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center px-6 pt-6 pb-10 gap-5 overflow-y-auto">
        <div className="relative w-full aspect-square max-w-[360px] rounded-[20px] overflow-hidden bg-black shadow-lg">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />

          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]" />
          {[
            "top-5 left-5 border-t-[3px] border-l-[3px] rounded-tl",
            "top-5 right-5 border-t-[3px] border-r-[3px] rounded-tr",
            "bottom-5 left-5 border-b-[3px] border-l-[3px] rounded-bl",
            "bottom-5 right-5 border-b-[3px] border-r-[3px] rounded-br",
          ].map((cls, i) => (
            <div
              key={i}
              className={cn("absolute w-8 h-8 border-[#ffa02e]", cls)}
            />
          ))}
          <div
            className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#ffa02e] to-transparent"
            style={{ top: `${scanLine}%` }}
          />

          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
              <p className="text-center text-sm text-red-400">{cameraError}</p>
            </div>
          )}
        </div>

        {/* <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-full px-4 py-2 mt-2">
        <span className="w-2 h-2 rounded-full bg-[#1c4d8d] animate-pulse" />
        <span className="text-[13px] font-medium text-[#1c4d8d] dark:text-blue-400">
          Scanning for QR code...
        </span>
      </div> */}

        <p className="text-center text-gray-400 text-xs px-4">
          Point the camera at the attendees registration QR code
        </p>
      </div>
    </div>
  );
}
