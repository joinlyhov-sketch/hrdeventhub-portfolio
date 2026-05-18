"use client";

import {
  FileText,
  Calendar,
  CreditCard,
  Receipt,
  CheckSquare,
  Copy,
} from "lucide-react";
import { TransactionDetail } from "../../../../types/transaction-detail";

interface DetailInfoRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  showCopy?: boolean;
  onCopy?: () => void;
}

function DetailInfoRow({
  label,
  value,
  icon,
  showCopy,
  onCopy,
}: DetailInfoRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="text-gray-700">{icon}</div>
        <p className="text-base text-[#64748B] font-medium">{label}</p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-base font-semibold text-gray-800">{value}</p>
        {showCopy && (
          <button
            onClick={onCopy}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}

interface TransactionDetailCardProps {
  detail: TransactionDetail;
}

export function TransactionDetailCard({ detail }: TransactionDetailCardProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm w-full">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-[#0F2854]" strokeWidth={2} />
        <h3 className="text-xl font-bold text-[#0F2854]">
          Transaction Summary
        </h3>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-base text-gray-400 font-medium mb-1">
            Total Amount
          </p>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-extrabold text-[#0F2854] tracking-tight">
              ${detail.amount.toFixed(2)}
            </span>
            <span className="bg-[#0F2854] text-white text-xs font-bold px-2 py-1 rounded-md">
              {detail.currency}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-base text-gray-400 font-medium mb-2">Status</p>
          <span className="inline-flex items-center gap-1.5 bg-[#E6F9F0] text-[#12B76A] text-sm font-semibold px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />
            {detail.status || "Successful"}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-2">
        <DetailInfoRow
          label="Date & Time"
          value={detail.processedDate}
          icon={<Calendar className="w-5 h-5" strokeWidth={1.75} />}
        />

        <DetailInfoRow
          label="Payment Method"
          value={detail.paymentMethod}
          icon={<CreditCard className="w-5 h-5" strokeWidth={1.75} />}
        />

        <DetailInfoRow
          label="Reference ID"
          value={detail.referenceId}
          icon={<Receipt className="w-5 h-5" strokeWidth={1.75} />}
          showCopy
          onCopy={() => handleCopy(detail.referenceId)}
        />

        <DetailInfoRow
          label="Transaction ID"
          value={detail.transactionId}
          icon={<CheckSquare className="w-5 h-5" strokeWidth={1.75} />}
          showCopy
          onCopy={() => handleCopy(detail.transactionId)}
        />
      </div>
    </div>
  );
}
