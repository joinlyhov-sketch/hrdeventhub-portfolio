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
    <div className="flex gap-3 items-center justify-between border border-gray-200 rounded-2xl p-2 shadow-sm hover:shadow-md hover:border-slate-200/60 transition-all duration-200 w-[250px] group">
      <div className="flex items-center gap-1">
        <div className="bg-[#F4F6F9] p-1.5 rounded-lg text-secondary shrink-0 group-hover:scale-105 transition-transform">
          <Icon className="w-5 h-5 stroke-[1.8]" />
        </div>
        <span className="type-desc text-secondary text-[10px] ">
          {label}
        </span>
      </div>
      <div className="shrink-0 flex items-center">
        {rightElement}
      </div>
    </div>
  );
}