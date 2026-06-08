"use client";

interface ReceiptRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function ReceiptRow({ icon, label, value }: ReceiptRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="mt-0.5 text-[#1e3a8a] opacity-60 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-[14px] text-gray-800 font-semibold mt-0.5 break-all">{value}</p>
      </div>
    </div>
  );
}