"use client";

import { ReactNode } from "react";

import { StatCard } from "../../../types/transaction";

interface StatsCardProps extends StatCard {
  customIcon?: ReactNode;
}

export function StatsCard({
  title,
  value,
  color,
  bgColor,
  customIcon,
}: StatsCardProps) {
  return (
    <div className="bg-background rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex flex-col items-start justify-between gap-2">
        <div className={`mb-1 p-2 ${bgColor} rounded-[8px]`}>{customIcon}</div>

        <div>
          <p className="text-gray-600 type-detail-semibold mb-2 ">{title}</p>

          <p className={`${color} type-title font-bold`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
