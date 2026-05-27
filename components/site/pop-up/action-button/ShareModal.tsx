"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog-payments/dialog";
import { Link2 } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  shareUrl = "hrdeventhub.app/share-link",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={true}
        className="max-w-[540px] w-full rounded-3xl border-none bg-white p-8 shadow-2xl gap-0"
      >
        <DialogHeader className="mb-6">
          <DialogTitle className="text-[28px] font-bold text-[#0f172a]">
            Share Modal
          </DialogTitle>
          <DialogDescription className="sr-only">
            Share this link via social platforms or copy directly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-[17px] font-semibold text-[#334155]">
              Share this link via
            </h4>
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-[56px] h-[56px] rounded-full border border-gray-100 flex items-center justify-center shadow-xs text-[#0077b5] hover:bg-gray-50 transition-colors"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>

              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                className="w-[56px] h-[56px] rounded-full border border-gray-100 flex items-center justify-center shadow-xs text-[#0088cc] hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-[22px] h-[22px] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.71-2.48 2.76-2.7.01-.03.01-.14-.05-.2-.06-.06-.14-.04-.2-.03-.08.01-1.37.86-3.87 2.55-.36.25-.7.37-1 .36-.34-.01-1-.2-1.49-.35-.6-.2-1.08-.3-1.03-.64.02-.18.28-.36.75-.54 2.93-1.27 4.88-2.11 5.87-2.5 2.8-1.12 3.38-1.31 3.76-1.32.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .34z" />
                </svg>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-[56px] h-[56px] rounded-full border border-gray-100 flex items-center justify-center shadow-xs text-[#1877f2] hover:bg-gray-50 transition-colors"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-[56px] h-[56px] rounded-full border border-gray-100 flex items-center justify-center shadow-xs text-[#e1306c] hover:bg-gray-50 transition-colors"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-[17px] font-semibold text-[#334155]">
              Or copy link
            </h4>
            <div className="flex items-center justify-between border border-gray-100 rounded-2xl p-2.5 bg-white w-full shadow-xs">
              <div className="flex items-center gap-3 pl-2 flex-1 min-w-0">
                <Link2 className="text-gray-400 rotate-45 shrink-0" size={20} />
                <span className="text-[15px] font-medium text-[#475569] truncate">
                  {shareUrl}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className={`h-[44px] px-6 text-white font-bold rounded-xl text-[15px] shadow-sm transition-all shrink-0 cursor-pointer ${
                  copied
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-[#ff9f38] hover:bg-[#e08626]"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
