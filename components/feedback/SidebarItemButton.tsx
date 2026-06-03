import React from "react";
import { Button } from "../ui/button";

interface SidebarItemButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function SidebarItemButton({
  label,
  icon,
  onClick,
}: SidebarItemButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="w-full justify-start px-3 py-2 h-12 gap-3 border-gray-100 bg-white rounded-xl flex items-center text-gray-500 text-sm font-semibold shadow-sm hover:bg-slate-50/50"
    >
      <span className="text-secondary p-1 bg-slate-100 rounded-lg group-hover:text-slate-600 transition-colors">
        {icon}
      </span>
      {label}
    </Button>
  );
}
