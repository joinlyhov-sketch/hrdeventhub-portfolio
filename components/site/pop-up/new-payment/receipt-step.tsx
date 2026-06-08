"use client";

import { CheckCircle2, Receipt, Hash, User, CreditCard, Building2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReceiptRow } from "./receipt";
import type { Transaction } from "@/service/payment.service";

interface ReceiptStepProps {
  transaction: Transaction | null;
  onClose: () => void;
}

function formatDate(raw: string): string {
  if (!raw || raw.length < 8) return raw;
  const y = raw.slice(0, 4);
  const m = raw.slice(4, 6);
  const d = raw.slice(6, 8);
  return `${d}/${m}/${y}`;
}

function formatTime(raw: string): string {
  if (!raw || raw.length < 6) return raw;
  return `${raw.slice(0, 2)}:${raw.slice(2, 4)}:${raw.slice(4, 6)}`;
}

export function ReceiptStep({ transaction, onClose }: ReceiptStepProps) {
  if (!transaction) return null;

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>
        <p className="text-[18px] font-bold text-gray-800">Payment Confirmed!</p>
        <p className="text-[13px] text-gray-500 text-center">
          You're now registered for this event.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-blue-50 shadow-sm px-4 py-2">
        <div className="flex items-center gap-2 py-3 border-b border-gray-50">
          <Receipt size={16} className="text-[#1e3a8a]" />
          <p className="text-[13px] font-bold text-[#1e3a8a] uppercase tracking-wide">
            Transaction Receipt
          </p>
        </div>

        <ReceiptRow icon={<Hash size={14} />} label="Bill No." value={transaction.billNo} />
        <ReceiptRow icon={<User size={14} />} label="Payer" value={transaction.payerName} />
        <ReceiptRow
          icon={<CreditCard size={14} />}
          label="Amount"
          value={`${transaction.amount.toFixed(2)} ${transaction.currencyCode}`}
        />
        <ReceiptRow icon={<Building2 size={14} />} label="Bank" value={transaction.senderBankName} />
        <ReceiptRow
          icon={<Calendar size={14} />}
          label="Transaction Date"
          value={formatDate(transaction.transactionDate)}
        />
        <ReceiptRow
          icon={<Clock size={14} />}
          label="Transaction Time"
          value={formatTime(transaction.transactionTime)}
        />
        {transaction.remark && transaction.remark !== "—" && (
          <ReceiptRow icon={<Receipt size={14} />} label="Remark" value={transaction.remark} />
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