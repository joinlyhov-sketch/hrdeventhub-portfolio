"use client";

import { ReactNode } from "react";
import { LucideIcon, Wallet, DollarSign, Users, Calendar } from "lucide-react";

import { StatCard } from "../../../types/transaction";

const iconMap: Record<string, LucideIcon> = {
  wallet: Wallet,
  dollar: DollarSign,
  users: Users,
  calendar: Calendar,
};

const valueColorMap: Record<string, string> = {
  blue: "text-blue-600",
  green: "text-green-600",
  red: "text-red-600",
  teal: "text-teal-600",
};

interface StatsCardProps extends StatCard {
  customIcon?: ReactNode;
}

export function StatsCard({ title, value, color, customIcon }: StatsCardProps) {
  return (
    <div className="bg-background rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex flex-col items-start justify-between gap-2">
        <div className="mb-1">{customIcon}</div>

        <div>
          <p className="text-gray-600 type-detail-semibold mb-2 ">{title}</p>

          <p className={`text-${color} type-title font-bold`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
