"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/libs/utils";
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
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const processingRef = useRef(false);
  const mountedRef = useRef(true);
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

  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startScanLoop = useCallback(
    (video: HTMLVideoElement) => {
      if (!("BarcodeDetector" in window)) {
        setCameraError(
          "QR scanning is not supported on this browser. Please use Chrome on Android.",
        );
        return;
      }

      const detector = new BarcodeDetector({ formats: ["qr_code"] });

      const tick = async () => {
        if (processingRef.current) return;
        try {
          const codes = await detector.detect(video);
          if (codes.length > 0 && codes[0].rawValue) {
            processingRef.current = true;
            stopCamera();
            const result = await checkInAttendeeAction(token, codes[0].rawValue);
            if(result.success){
              onSuccess(result.data);
            }else {
              onError(result.error);
            }
            return;
          }
        } catch (_) {}
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [stopCamera, token, onSuccess, onError],
  );

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        video.onloadedmetadata = () => {
          if (cancelled || !videoRef.current) return;
          videoRef.current
            .play()
            .then(() => {
              if (!cancelled && videoRef.current) {
                startScanLoop(videoRef.current);
              }
            })
            .catch((err) => {
              if (err.name !== "AbortError") {
                console.error("Video play error:", err);
              }
            });
        };
      })
      .catch(() => {
        if (!cancelled) {
          setCameraError(
            "Camera access denied. Allow camera permission and try again.",
          );
        }
      });

    return () => {
      cancelled = true;
      mountedRef.current = false;
      stopCamera();
    };
  }, [startScanLoop, stopCamera]);

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
          stopCamera();
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