"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/posts";

interface SuccessStepProps {
  post: Post;
  successMessage: string;
  remark: string;
  amountLabel?: string;
  onClose: () => void;
}

export function SuccessStep({
  post,
  successMessage,
  remark,
  amountLabel = "Free",
  onClose,
}: SuccessStepProps) {
  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 size={44} className="text-green-500" />
        </div>

        <p className="text-[20px] font-bold text-gray-800 text-center">
          You&apos;re Registered!
        </p>

        <p className="text-[14px] text-gray-500 text-center max-w-[300px]">
          {successMessage}
        </p>
      </div>

      <div className="bg-blue-50/60 rounded-xl px-4 py-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-[13px] text-gray-500">Event</span>
          <span className="text-[13px] font-semibold text-gray-800 max-w-[180px] text-right truncate">
            {post.title}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[13px] text-gray-500">Amount Paid</span>
          <span className="text-[13px] font-bold text-green-600">
            {amountLabel}
          </span>
        </div>

        {remark && remark !== "—" && (
          <div className="flex justify-between">
            <span className="text-[13px] text-gray-500">Remark</span>
            <span className="text-[13px] text-gray-700 max-w-[180px] text-right">
              {remark}
            </span>
          </div>
        )}
      </div>

      <Button
        onClick={onClose}
        className="w-full h-[48px] rounded-xl font-semibold text-[15px] bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white shadow-md shadow-blue-900/10 transition-all"
      >
        Done
      </Button>
    </div>
  );
}