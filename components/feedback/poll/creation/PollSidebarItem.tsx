import React from "react";
import { LucideIcon } from "lucide-react";

interface PollSidebarItemProps {
  label: string;
  icon: LucideIcon;
  rightElement: React.ReactNode;
}

export default function PollSidebarItem({
  label,
  icon: Icon,
  rightElement,
}: PollSidebarItemProps) {
  return (
    <div className="flex gap-3 items-center justify-between border border-slate-100 rounded-2xl p-2 shadow-sm hover:shadow-md hover:border-slate-200/60 transition-all duration-200 w-[250px] group">
      <div className="flex items-center gap-1">
        <div className="bg-blue-50/50 p-1 rounded-lg text-secondary border border-blue-50/10 shrink-0 group-hover:scale-105 transition-transform">
          <Icon className="w-5 h-5 stroke-[1.8]" />
        </div>
        <span className="font-semibold text-gray-600 text-[10px] ">
          {label}
        </span>
      </div>
      <div className="shrink-0 flex items-center">
        {rightElement}
      </div>
    </div>
  );
}