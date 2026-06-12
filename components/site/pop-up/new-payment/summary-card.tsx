"use client";

interface SummaryCardProps {
  eventTitle: string;
  amount: string;
  payerName: string;
  billNo: string;
}

export function SummaryCard({ eventTitle, amount, payerName, billNo }: SummaryCardProps) {
  return (
    <div className="bg-blue-50/60 rounded-xl px-4 py-4 space-y-2.5">
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-gray-500">Event</span>
        <span className="text-[13px] font-semibold text-gray-800 max-w-[200px] text-right truncate">{eventTitle}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-gray-500">Amount</span>
        <span className="text-[13px] font-bold text-[#1e3a8a]">{amount}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-gray-500">Payer</span>
        <span className="text-[13px] font-semibold text-gray-800">{payerName}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-gray-500">Bill No.</span>
        <span className="text-[13px] font-mono text-gray-700">{billNo}</span>
      </div>
    </div>
  );
}